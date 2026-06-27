"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	CheckCircle2,
	Circle,
	CreditCard,
	ExternalLink,
	Package,
	Search,
	Truck,
	XCircle,
} from "lucide-react";
import { Typography } from "@/components";
import {
	useGetMyOrdersQuery,
	type IOrder,
	type ITimelineEntry,
} from "@/redux/api/orders";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

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
		case "payment": return <CreditCard size={10} />;
		case "fulfillment": return <Truck size={10} />;
		case "status": return <Package size={10} />;
		default: return <Circle size={10} />;
	}
};

const buildFallback = (order: IOrder): ITimelineEntry[] => {
	const e: ITimelineEntry[] = [{ type: "status", message: "Order placed", at: order.createdAt }];
	if (order.paidAt) e.push({ type: "payment", message: "Payment confirmed", at: order.paidAt });
	if (order.shipment?.shippedAt) e.push({ type: "fulfillment", message: `Shipped via ${order.shipment.courier || "courier"}`, at: order.shipment.shippedAt });
	if (order.shipment?.deliveredAt) e.push({ type: "fulfillment", message: "Delivered", at: order.shipment.deliveredAt });
	if (order.status === "cancelled") e.push({ type: "status", message: "Order cancelled", at: order.createdAt });
	return e;
};

const Timeline = ({ entries }: { entries: ITimelineEntry[] }) => {
	const sorted = [...entries].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
	return (
		<div className="relative pl-5">
			<div className="absolute left-[7px] top-1 bottom-1 w-px bg-N30" />
			{sorted.map((entry, i) => {
				const isFirst = i === 0;
				const isCancelled = entry.message.toLowerCase().includes("cancel");
				return (
					<div key={i} className="relative pb-4 last:pb-0">
						<div className={`absolute -left-5 top-0.5 w-[16px] h-[16px] rounded-full grid place-items-center z-10 ${
							isCancelled ? "bg-R400 text-white"
								: isFirst ? "bg-BR500 text-white"
									: "bg-white border-2 border-N200 text-N400"
						}`}>
							{isCancelled ? <XCircle size={8} /> : isFirst ? <CheckCircle2 size={8} /> : timelineIcon(entry.type)}
						</div>
						<div className={`text-[13px] ${isFirst ? "font-semibold" : ""} ${isCancelled ? "text-R500" : "text-N700"}`}>
							{entry.message}
						</div>
						<div className="text-[11px] text-N400">{formatDate(entry.at)}</div>
					</div>
				);
			})}
		</div>
	);
};

const statusCls = (o: IOrder) => {
	if (o.status === "cancelled") return "bg-R50 text-R500";
	if (o.fulfillmentStatus === "delivered") return "bg-G50 text-G600";
	if (o.fulfillmentStatus === "shipped") return "bg-B50 text-B600";
	if (o.paymentStatus === "paid") return "bg-G50 text-G600";
	return "bg-O50 text-O600";
};

const statusText = (o: IOrder) => {
	if (o.status === "cancelled") return "Cancelled";
	if (o.fulfillmentStatus === "delivered") return "Delivered";
	if (o.fulfillmentStatus === "shipped") return "Shipped";
	if (o.status === "processing") return "Processing";
	return "Pending";
};

const Card = ({ order }: { order: IOrder }) => {
	const tl = order.timeline?.length ? order.timeline : buildFallback(order);
	return (
		<div className="border border-N30 rounded overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between px-4 py-2.5 bg-N10 border-b border-N30">
				<div className="flex items-center gap-2.5">
					<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${order._id}`} className="text-sm font-semibold text-N800 hover:text-BR500">
						{order.orderNumber}
					</Link>
					<span className={`text-[11px] px-2 py-0.5 rounded font-medium ${statusCls(order)}`}>
						{statusText(order)}
					</span>
				</div>
				<span className="text-sm font-semibold text-N800">{money(order.grandTotal)}</span>
			</div>

			<div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-N30">
				{/* Items + courier */}
				<div className="flex-1 p-4">
					<div className="flex gap-2 flex-wrap mb-3">
						{order.items.slice(0, 4).map((it, i) => (
							<div key={i} className="w-10 h-10 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
								{it.image ? <Image src={it.image} alt={it.name} fill className="object-cover" /> : (
									<div className="w-full h-full grid place-items-center"><Package size={12} className="text-N300" /></div>
								)}
							</div>
						))}
						{order.items.length > 4 && (
							<div className="w-10 h-10 rounded bg-N10 grid place-items-center shrink-0 text-xs text-N400 font-medium">
								+{order.items.length - 4}
							</div>
						)}
					</div>
					{order.shipment?.courier && (
						<div className="flex items-center justify-between gap-2 pt-3 border-t border-N20">
							<div className="flex items-center gap-2">
								{order.shipment.courierLogo ? (
									<div className="w-6 h-6 rounded bg-N10 overflow-hidden relative shrink-0">
										<Image src={order.shipment.courierLogo} alt="" fill className="object-contain" />
									</div>
								) : <Truck size={13} className="text-N400" />}
								<span className="text-xs text-N600">{order.shipment.courier}</span>
							</div>
							{order.shipment.trackingUrl && (
								<a href={order.shipment.trackingUrl} target="_blank" rel="noreferrer" className="text-xs text-BR500 hover:underline flex items-center gap-1 font-medium">
									Track <ExternalLink size={10} />
								</a>
							)}
						</div>
					)}
				</div>

				{/* Timeline */}
				<div className="sm:w-[240px] p-4">
					<div className="text-xs text-N400 mb-2.5 font-medium">Timeline</div>
					<Timeline entries={tl} />
				</div>
			</div>

			{/* Footer */}
			<div className="border-t border-N30 px-4 py-2 bg-N10">
				<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${order._id}`} className="text-xs text-BR500 hover:underline font-medium">
					View full details →
				</Link>
			</div>
		</div>
	);
};

const TrackOrderPage = () => {
	const [search, setSearch] = useState("");
	const { data, isLoading } = useGetMyOrdersQuery({ pageSize: 50 });

	const orders = data?.data.data ?? [];
	const active = orders.filter((o) => o.status !== "cancelled" && o.fulfillmentStatus !== "delivered");
	const completed = orders.filter((o) => o.fulfillmentStatus === "delivered" || o.status === "cancelled");
	const filtered = search.trim()
		? orders.filter((o) => o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.items.some((it) => it.name.toLowerCase().includes(search.toLowerCase())))
		: null;

	return (
		<div>
			<h2 className="text-lg font-bold text-N900 mb-1">Track Orders</h2>
			<p className="text-sm text-N400 mb-5">Track the status and history of your orders.</p>

			<div className="flex gap-2 mb-6 max-w-md">
				<div className="relative flex-1">
					<input
						type="text"
						placeholder="Search by order number or product name"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none pr-10"
					/>
					<Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-N400" />
				</div>
			</div>

			{isLoading ? (
				<div className="text-N400 py-12 text-center">Loading…</div>
			) : orders.length === 0 ? (
				<div className="text-center py-20 flex flex-col items-center gap-3">
					<Package size={48} className="text-N200" />
					<Typography color="N500" className="text-sm">No orders to track yet.</Typography>
					<Link href="/shop" className="text-sm text-BR500 hover:underline font-medium">Start shopping</Link>
				</div>
			) : (
				<div className="flex flex-col gap-5">
					{filtered ? (
						<>
							<p className="text-sm text-N500">{filtered.length} result{filtered.length === 1 ? "" : "s"} for &ldquo;{search}&rdquo;</p>
							{filtered.map((o) => <Card key={o._id} order={o} />)}
						</>
					) : (
						<>
							{active.length > 0 && (
								<div>
									<h3 className="text-sm font-semibold text-N800 mb-3">Active Orders ({active.length})</h3>
									<div className="flex flex-col gap-4">{active.map((o) => <Card key={o._id} order={o} />)}</div>
								</div>
							)}
							{completed.length > 0 && (
								<div className="mt-2">
									<h3 className="text-sm font-semibold text-N500 mb-3">Completed / Cancelled ({completed.length})</h3>
									<div className="flex flex-col gap-4">{completed.map((o) => <Card key={o._id} order={o} />)}</div>
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default TrackOrderPage;
