"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowLeft,
	CheckCircle2,
	Circle,
	CreditCard,
	ExternalLink,
	Package,
	Truck,
	XCircle,
} from "lucide-react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { Button, Typography, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import {
	useGetMyOrderQuery,
	useCancelMyOrderMutation,
	type IOrder,
	type ITimelineEntry,
} from "@/redux/api/orders";
import { useGetMyDisputesQuery } from "@/redux/api/disputes";
import { AuthRouteConfig } from "@/constants/routes";
import { getApiErrorMessage } from "@/utils/helpers";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const statusLabel = (o: IOrder) => {
	if (o.status === "cancelled") return { text: "Cancelled", cls: "bg-R50 text-R500 border-R100", dot: "bg-R400", tip: "This order has been cancelled" };
	if (o.paymentStatus === "refunded") return { text: "Refunded", cls: "bg-G50 text-G600 border-G100", dot: "bg-G500", tip: "Payment has been refunded" };
	if (o.fulfillmentStatus === "delivered") return { text: "Delivered", cls: "bg-G50 text-G600 border-G100", dot: "bg-G500", tip: "Order has been delivered" };
	if (o.fulfillmentStatus === "shipped") return { text: "Shipped", cls: "bg-B50 text-B600 border-B100", dot: "bg-B500", tip: "Order is on its way" };
	if (o.status === "processing") return { text: "Processing", cls: "bg-B50 text-B600 border-B100", dot: "bg-B500", tip: "Order is being prepared" };
	if (o.paymentStatus === "paid") return { text: "Paid", cls: "bg-G50 text-G600 border-G100", dot: "bg-G500", tip: "Payment received, awaiting fulfillment" };
	if (o.paymentStatus === "failed") return { text: "Failed", cls: "bg-R50 text-R500 border-R100", dot: "bg-R400", tip: "Payment was not successful" };
	return { text: "Pending", cls: "bg-O50 text-O600 border-O100", dot: "bg-O500", tip: "Awaiting payment" };
};

const providerLabel = (p?: string) => {
	if (p === "stripe") return "Stripe";
	return "Paystack";
};

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => (
	<span className="relative group cursor-default">
		{children}
		<span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 text-[11px] text-white bg-N800 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
			{text}
		</span>
	</span>
);

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

const timelineIcon = (type: string) => {
	switch (type) {
		case "payment": return <CreditCard size={12} />;
		case "fulfillment": return <Truck size={12} />;
		case "status": return <Package size={12} />;
		default: return <Circle size={12} />;
	}
};

const TimelineView = ({ entries }: { entries: ITimelineEntry[] }) => {
	const sorted = [...entries].sort(
		(a, b) => new Date(b.at).getTime() - new Date(a.at).getTime(),
	);
	return (
		<div className="relative pl-6">
			<div className="absolute left-[9px] top-2 bottom-2 w-px bg-N30" />
			{sorted.map((entry, i) => {
				const isFirst = i === 0;
				const isCancelled = entry.message.toLowerCase().includes("cancel");
				return (
					<div key={i} className="relative pb-5 last:pb-0">
						<div
							className={`absolute -left-6 top-0.5 w-[18px] h-[18px] rounded-full grid place-items-center z-10 ${
								isCancelled
									? "bg-R400 text-white"
									: isFirst
										? "bg-BR500 text-white"
										: "bg-white border-2 border-N200 text-N400"
							}`}
						>
							{isCancelled ? <XCircle size={10} /> : isFirst ? <CheckCircle2 size={10} /> : timelineIcon(entry.type)}
						</div>
						<div>
							<div className={`text-sm ${isFirst ? "font-semibold" : ""} ${isCancelled ? "text-R500" : "text-N800"}`}>
								{entry.message}
							</div>
							<div className="text-xs text-N400 mt-0.5">{formatDate(entry.at)}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

const FallbackTimeline = ({ order }: { order: IOrder }) => {
	const entries: ITimelineEntry[] = [
		{ type: "status", message: "Order placed", at: order.createdAt },
	];
	if (order.paidAt) entries.push({ type: "payment", message: "Payment confirmed", at: order.paidAt });
	if (order.shipment?.shippedAt) entries.push({ type: "fulfillment", message: `Shipped via ${order.shipment.courier || "courier"}`, at: order.shipment.shippedAt });
	if (order.shipment?.deliveredAt) entries.push({ type: "fulfillment", message: "Delivered", at: order.shipment.deliveredAt });
	if (order.status === "cancelled") entries.push({ type: "status", message: "Order cancelled", at: order.createdAt });
	return <TimelineView entries={entries} />;
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<div className="border border-N30 rounded mb-5">
		<div className="px-5 py-3 border-b border-N30 bg-N10">
			<span className="text-sm font-semibold text-N800">{title}</span>
		</div>
		<div className="px-5 py-4">{children}</div>
	</div>
);

const disputeStatusCls: Record<string, string> = {
	open: "bg-B50 text-B600", under_review: "bg-O50 text-O600",
	resolved: "bg-G50 text-G600", rejected: "bg-R50 text-R500", refunded: "bg-G50 text-G600",
};
const disputeStatusLabel: Record<string, string> = {
	open: "Open", under_review: "Under Review", resolved: "Resolved", rejected: "Rejected", refunded: "Refunded",
};
const disputeStatusTip: Record<string, string> = {
	open: "Dispute is awaiting review",
	under_review: "Our team is reviewing this dispute",
	resolved: "Dispute has been resolved",
	rejected: "Dispute was not approved",
	refunded: "Refund has been processed",
};

const OrderDetail = ({ params }: { params: { id: string } }) => {
	const { data, isLoading, isError } = useGetMyOrderQuery(params.id);
	const [cancelOrder, { isLoading: cancelling }] = useCancelMyOrderMutation();
	const [showCancel, setShowCancel] = useState(false);
	const [cancelReason, setCancelReason] = useState("");
	const { data: disputesData } = useGetMyDisputesQuery({ pageSize: 50 });
	const order = data?.data;

	if (isLoading) return <div className="text-N400 py-12 text-center">Loading order…</div>;

	if (isError || !order) {
		return (
			<div className="text-center py-20 flex flex-col items-center gap-3">
				<Package size={48} className="text-N200" />
				<Typography color="N500" className="text-sm">Order not found.</Typography>
				<Link href={AuthRouteConfig.ACCOUNT_ORDERS} className="text-sm text-BR500 hover:underline font-medium">
					Back to orders
				</Link>
			</div>
		);
	}

	const badge = statusLabel(order);
	const addr = order.shippingAddress;

	return (
		<>
		<div>
			{/* Back + header */}
			<Link
				href={AuthRouteConfig.ACCOUNT_ORDERS}
				className="inline-flex items-center gap-1 text-sm text-N500 hover:text-N800 mb-5"
			>
				<ArrowLeft size={14} /> Back to orders
			</Link>

			<div className="flex items-start justify-between gap-4 flex-wrap mb-6">
				<div>
					<h2 className="text-lg font-bold text-N900">{order.orderNumber}</h2>
					<div className="text-sm text-N400 mt-0.5">Placed on {formatDate(order.createdAt)}</div>
				</div>
				<div className="flex items-center gap-2">
					{order.status !== "cancelled" && order.fulfillmentStatus !== "shipped" && order.fulfillmentStatus !== "delivered" && (
						<button onClick={() => setShowCancel(true)} className="text-xs text-R500 hover:text-R400 font-medium">Cancel order</button>
					)}
					<Tooltip text={badge.tip}>
						<span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium ${badge.cls}`}>
							<span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
							{badge.text}
						</span>
					</Tooltip>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
				{/* Left */}
				<div>
					{/* Items */}
					<Section title={`Items (${order.items.length})`}>
						<div className="divide-y divide-N20">
							{order.items.map((it, i) => (
								<div key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
									<div className="w-14 h-14 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
										{it.image ? (
											<Image src={it.image} alt={it.name} fill className="object-cover" />
										) : (
											<div className="w-full h-full grid place-items-center">
												<Package size={16} className="text-N300" />
											</div>
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="text-sm text-N800">{it.name}</div>
										{it.sku && <div className="text-xs text-N400 font-mono">SKU: {it.sku}</div>}
										<div className="text-xs text-N400 mt-0.5">{money(it.unitPrice)} × {it.quantity}</div>
									</div>
									<div className="text-sm font-semibold text-N800 shrink-0">{money(it.lineTotal)}</div>
								</div>
							))}
						</div>

						{/* Totals */}
						<div className="border-t border-N30 mt-4 pt-3 flex flex-col gap-1.5">
							<div className="flex justify-between text-sm">
								<span className="text-N500">Subtotal</span>
								<span className="text-N800">{money(order.subtotal)}</span>
							</div>
							{order.discountTotal > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-N500">Discount</span>
									<span className="text-G600">−{money(order.discountTotal)}</span>
								</div>
							)}
							<div className="flex justify-between text-sm">
								<span className="text-N500">Shipping</span>
								<span className="text-N800">{money(order.shippingFee)}</span>
							</div>
							{order.taxAmount > 0 && (
								<div className="flex justify-between text-sm">
									<span className="text-N500">Tax</span>
									<span className="text-N800">{money(order.taxAmount)}</span>
								</div>
							)}
							<div className="flex justify-between text-sm font-bold border-t border-N30 pt-2 mt-1">
								<span>Total</span>
								<span>{money(order.grandTotal)}</span>
							</div>
						</div>
					</Section>

					{/* Address */}
					{addr && (
						<Section title="Delivery Address">
							<div className="text-sm font-semibold text-N800">
								{addr.fullName || `${addr.firstName} ${addr.lastName}`}
							</div>
							<div className="text-sm text-N500 mt-1">
								{addr.phone}{addr.additionalPhone ? ` · ${addr.additionalPhone}` : ""}
							</div>
							<div className="text-sm text-N500 mt-1">
								{addr.address}{addr.landmark ? ` (${addr.landmark})` : ""}{`, ${addr.city}, ${addr.state}`}{addr.country ? `, ${addr.country}` : ""}{addr.postalCode ? ` ${addr.postalCode}` : ""}
							</div>
						</Section>
					)}
				</div>

				{/* Right */}
				<div>
					{/* Payment */}
					<Section title="Payment">
						<div className="flex flex-col gap-2">
							<div className="flex justify-between text-sm">
								<span className="text-N500">Status</span>
								<Tooltip text={
									order.paymentStatus === "paid" ? "Payment received successfully"
										: order.paymentStatus === "refunded" ? "Funds returned to customer"
											: order.paymentStatus === "failed" ? "Payment attempt failed"
												: "Awaiting payment"
								}>
									<span className={`font-medium capitalize ${
										order.paymentStatus === "paid" ? "text-G600"
											: order.paymentStatus === "failed" || order.paymentStatus === "refunded" ? "text-R500"
												: "text-O600"
									}`}>{order.paymentStatus}</span>
								</Tooltip>
							</div>
							<div className="flex justify-between text-sm">
								<span className="text-N500">Method</span>
								<span className="text-N800">{providerLabel(order.paymentProvider)}</span>
							</div>
							{order.paidAt && (
								<div className="flex justify-between text-sm">
									<span className="text-N500">Paid on</span>
									<span className="text-N800 text-xs">{formatDate(order.paidAt)}</span>
								</div>
							)}
						</div>
					</Section>

					{/* Shipment */}
					{order.shipment?.courier && (
						<Section title="Shipment">
							<div className="flex items-center gap-3 mb-3">
								{order.shipment.courierLogo ? (
									<div className="w-9 h-9 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
										<Image src={order.shipment.courierLogo} alt="" fill className="object-contain p-1" />
									</div>
								) : (
									<div className="w-9 h-9 rounded bg-N10 grid place-items-center shrink-0">
										<Truck size={14} className="text-N400" />
									</div>
								)}
								<div>
									<div className="text-sm font-medium text-N800">{order.shipment.courier}</div>
									{order.shipment.trackingNumber && (
										<div className="text-xs text-N400 font-mono">{order.shipment.trackingNumber}</div>
									)}
								</div>
							</div>
							{order.shipment.trackingUrl && (
								<a
									href={order.shipment.trackingUrl}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-1.5 text-sm text-BR500 hover:underline font-medium"
								>
									Track shipment <ExternalLink size={12} />
								</a>
							)}
						</Section>
					)}

					{/* Timeline */}
					<Section title="Order Timeline">
						{order.timeline && order.timeline.length > 0 ? (
							<TimelineView entries={order.timeline} />
						) : (
							<FallbackTimeline order={order} />
						)}
					</Section>

					{/* Disputes */}
					{(() => {
						const orderDisputes = (disputesData?.data.data ?? []).filter((d) => d.order._id === params.id);
						if (orderDisputes.length === 0) return null;
						return (
							<Section title="Disputes">
								<div className="flex flex-col gap-3">
									{orderDisputes.map((d) => (
										<div key={d._id} className="flex items-start gap-3">
											<RotateCcw size={14} className="text-N400 mt-0.5 shrink-0" />
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<span className="text-sm text-N800 capitalize">{d.type.replace(/_/g, " ")}</span>
													<Tooltip text={disputeStatusTip[d.status] || d.status}>
													<span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${disputeStatusCls[d.status]}`}>{disputeStatusLabel[d.status]}</span>
												</Tooltip>
												</div>
												<div className="text-xs text-N400">{d.reason}</div>
												{d.resolution && <div className="text-xs text-G600 mt-0.5">{d.resolution}</div>}
												{d.refundAmount && d.refundAmount > 0 && <div className="text-xs text-G600">Refunded: {money(d.refundAmount)}</div>}
											</div>
											<Link href={AuthRouteConfig.ACCOUNT_RETURNS} className="flex items-center gap-1 text-xs text-BR500 hover:text-BR400 font-medium shrink-0">
												<MessageCircle size={11} /> View
											</Link>
										</div>
									))}
								</div>
							</Section>
						);
					})()}
				</div>
			</div>
		</div>

		<Modal isOpen={showCancel} key="cancel-modal" closeModal={() => setShowCancel(false)} title="Cancel order" mobileLayoutType="normal"
			footerData={<div className="flex gap-3 justify-end">
				<Button variant="gold" onClick={() => setShowCancel(false)}>Keep order</Button>
				<Button variant="brown-light" loading={cancelling} className="!bg-R500" onClick={async () => {
					try {
						await cancelOrder({ id: params.id, reason: cancelReason.trim() || undefined }).unwrap();
						notify.success({ message: "Order cancelled" });
						setShowCancel(false);
					} catch (err) { notify.error({ message: "Cannot cancel", subtitle: getApiErrorMessage(err) }); }
				}}>Cancel order</Button>
			</div>}>
			<div className="p-6 flex flex-col gap-4">
				<p className="text-sm text-N600">Are you sure you want to cancel this order? Stock will be restored and any pending shipment will be cancelled.</p>
				<div>
					<label className="text-xs text-N500 mb-1 block">Reason (optional)</label>
					<input value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} placeholder="Why are you cancelling?"
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
				</div>
				<p className="text-xs text-N400">If you&apos;ve already been charged, open a dispute for a refund instead.</p>
			</div>
		</Modal>
		</>
	);
};

export default OrderDetail;
