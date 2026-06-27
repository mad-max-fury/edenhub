"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Package, RotateCcw, Search } from "lucide-react";
import { Button, Typography, notify, SMSelectDropDown, TextField } from "@/components";
import type { OptionType } from "@/components/smSelect/smSelect";
import { Modal } from "@/components/modal/modal";
import { getApiErrorMessage } from "@/utils/helpers";
import { useGetMyOrdersQuery, type IOrder } from "@/redux/api/orders";
import {
	useCreateDisputeMutation,
	useGetMyDisputesQuery,
	useGetMyDisputeQuery,
	useSendDisputeMessageMutation,
	useCloseMyDisputeMutation,
	type IDispute,
} from "@/redux/api/disputes";
import { AuthRouteConfig } from "@/constants/routes";
import { useUploadChatFileMutation } from "@/redux/api/conversations";
import { RichChat } from "@/components/chat/RichChat";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const DISPUTE_TYPES: OptionType[] = [
	{ label: "Return", value: "return" },
	{ label: "Refund", value: "refund" },
	{ label: "Item Damaged", value: "damaged" },
	{ label: "Wrong Item Received", value: "wrong_item" },
	{ label: "Not Received", value: "not_received" },
	{ label: "Quality Issue", value: "quality" },
	{ label: "Other", value: "other" },
];

const REASON_OPTIONS: OptionType[] = [
	{ label: "Wrong item received", value: "Wrong item received" },
	{ label: "Item arrived damaged", value: "Item arrived damaged" },
	{ label: "Not as described", value: "Not as described" },
	{ label: "Quality not satisfactory", value: "Quality not satisfactory" },
	{ label: "Size/fit issue", value: "Size/fit issue" },
	{ label: "Changed my mind", value: "Changed my mind" },
	{ label: "Other", value: "Other" },
];

type Tab = "disputes" | "eligible";

const statusCls: Record<string, string> = {
	open: "bg-B50 text-B600",
	under_review: "bg-O50 text-O600",
	resolved: "bg-G50 text-G600",
	rejected: "bg-R50 text-R500",
	refunded: "bg-G50 text-G600",
};

const statusLabel: Record<string, string> = {
	open: "Open",
	under_review: "Under Review",
	resolved: "Resolved",
	rejected: "Rejected",
	refunded: "Refunded",
};

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const formatTime = (iso: string) =>
	new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

// ── Dispute chat modal ──
const DisputeChat = ({ disputeId, onClose }: { disputeId: string; onClose: () => void }) => {
	const { data, isLoading, refetch } = useGetMyDisputeQuery(disputeId);
	const [sendMsg] = useSendDisputeMessageMutation();
	const [closeDispute, { isLoading: closing }] = useCloseMyDisputeMutation();
	const [uploadChatFile] = useUploadChatFileMutation();
	const [showCloseConfirm, setShowCloseConfirm] = useState(false);
	const dispute = data?.data;

	const send = async (body: string, attachments: { url: string; type: string; name?: string }[]) => {
		try { await sendMsg({ id: disputeId, body: body || (attachments.length ? "📎" : "") }).unwrap(); refetch(); }
		catch (err) { notify.error({ message: "Failed", subtitle: getApiErrorMessage(err) }); }
	};

	const handleUpload = async (file: File) => {
		const fd = new FormData();
		fd.append("file", file);
		const res = await uploadChatFile(fd).unwrap();
		return res.data.url;
	};

	if (isLoading || !dispute) return <div className="text-N400 py-12 text-center">Loading…</div>;

	const isOpen = dispute.status === "open" || dispute.status === "under_review";

	return (
		<div className="flex flex-col" style={{ minHeight: "55vh" }}>
			{/* Info card */}
			<div className="border border-N30 rounded p-4 mb-4 shrink-0">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${dispute.order._id}`} className="text-sm font-semibold text-N900 hover:text-BR500">
							{dispute.order.orderNumber}
						</Link>
						<span className={`text-[10px] px-2 py-0.5 rounded font-medium ${statusCls[dispute.status]}`}>{statusLabel[dispute.status]}</span>
					</div>
					<span className="text-xs text-N400">{formatDate(dispute.createdAt)}</span>
				</div>
				<div className="grid grid-cols-2 gap-2 text-xs">
					<div><span className="text-N400">Type:</span> <span className="text-N700 capitalize">{dispute.type.replace(/_/g, " ")}</span></div>
					<div><span className="text-N400">Reason:</span> <span className="text-N700">{dispute.reason}</span></div>
					{dispute.order.grandTotal && (
						<div><span className="text-N400">Order total:</span> <span className="text-N700">{money(dispute.order.grandTotal)}</span></div>
					)}
					{dispute.refundAmount && dispute.refundAmount > 0 && (
						<div><span className="text-N400">Refunded:</span> <span className="text-G600 font-medium">{money(dispute.refundAmount)}</span></div>
					)}
				</div>
				{dispute.resolution && (
					<div className="mt-2 pt-2 border-t border-N20 text-xs">
						<span className="text-N400">Resolution:</span> <span className="text-G600">{dispute.resolution}</span>
					</div>
				)}
				{dispute.description && (
					<div className="mt-2 pt-2 border-t border-N20 text-xs text-N500">{dispute.description}</div>
				)}
			</div>

			{/* Chat */}
			<div className="flex-1 min-h-0 relative" style={{ height: "300px" }}>
				<RichChat
					messages={dispute.messages.map((m) => ({ ...m, read: true, senderId: typeof m.senderId === "object" ? m.senderId?._id : m.senderId })) as any}
					myRole="customer"
					isOpen={isOpen}
					dateLabel="Conversation started"
					closedMessage={`Dispute ${dispute.status.replace(/_/g, " ")}.`}
					onSend={send}
					onUploadFile={handleUpload}
				/>
			</div>

			{/* Footer actions */}
			{isOpen && (
				<div className="flex items-center justify-between pt-3 shrink-0">
					<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${dispute.order._id}`} className="text-[11px] text-BR500 hover:underline">View order</Link>
					{!showCloseConfirm ? (
						<button onClick={() => setShowCloseConfirm(true)} className="text-xs text-N500 hover:text-N800 font-medium">
							Close dispute
						</button>
					) : (
						<div className="flex items-center gap-2">
							<span className="text-xs text-N500">Sure?</span>
							<button onClick={async () => {
								try { await closeDispute({ id: disputeId }).unwrap(); notify.success({ message: "Dispute closed" }); refetch(); setShowCloseConfirm(false); }
								catch (err) { notify.error({ message: "Failed", subtitle: getApiErrorMessage(err) }); }
							}} disabled={closing} className="text-xs text-G600 hover:underline font-medium">
								{closing ? "…" : "Yes, resolve"}
							</button>
							<button onClick={() => setShowCloseConfirm(false)} className="text-xs text-N400 hover:text-N700">Cancel</button>
						</div>
					)}
				</div>
			)}

			{!isOpen && (
				<div className="pt-3 shrink-0">
					<div className={`text-center text-sm font-medium px-4 py-2.5 rounded ${
						dispute.status === "resolved" || dispute.status === "refunded" ? "bg-G50 text-G600" : "bg-R50 text-R500"
					}`}>
						{dispute.status === "refunded" ? `Refunded — ${money(dispute.refundAmount)}`
							: dispute.status === "resolved" ? "Resolved by support"
								: dispute.status === "rejected" ? "Dispute rejected"
									: `Dispute ${dispute.status.replace(/_/g, " ")}`}
					</div>
					<div className="flex justify-center mt-3">
						<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${dispute.order._id}`} className="text-xs text-BR500 hover:underline">View order details</Link>
					</div>
				</div>
			)}
		</div>
	);
};

const ReturnsPage = () => {
	const [tab, setTab] = useState<Tab>("disputes");
	const [search, setSearch] = useState("");
	const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
	const [chatDisputeId, setChatDisputeId] = useState<string | null>(null);
	const [disputeType, setDisputeType] = useState<OptionType | null>(null);
	const [reason, setReason] = useState<OptionType | null>(null);
	const [description, setDescription] = useState("");

	const { data: ordersData } = useGetMyOrdersQuery({ pageSize: 100 });
	const { data: disputesData, isLoading: loadingDisputes } = useGetMyDisputesQuery({ pageSize: 50 });
	const [createDispute, { isLoading: creating }] = useCreateDisputeMutation();

	const allOrders = ordersData?.data.data ?? [];
	const disputes = disputesData?.data.data ?? [];

	// Build a map of orderId -> dispute for quick lookup
	const orderDisputeMap = new Map<string, IDispute>();
	disputes.forEach((d) => { orderDisputeMap.set(d.order._id, d); });

	// Eligible: delivered + paid, OR refunded (to show refunded orders)
	const eligibleOrders = allOrders.filter(
		(o) => (o.fulfillmentStatus === "delivered" && o.paymentStatus === "paid" && o.status !== "cancelled")
			|| o.paymentStatus === "refunded",
	);

	const filtered = search.trim()
		? (tab === "disputes"
			? disputes.filter((d) => d.order.orderNumber.toLowerCase().includes(search.toLowerCase()))
			: eligibleOrders.filter((o) => o.orderNumber.toLowerCase().includes(search.toLowerCase()))
		) : null;

	const submitDispute = async () => {
		if (!selectedOrder || !disputeType || !reason) {
			notify.error({ message: "Please fill all required fields" }); return;
		}
		try {
			await createDispute({
				orderId: selectedOrder._id, type: String(disputeType.value),
				reason: String(reason.value), description: description.trim() || undefined,
			}).unwrap();
			notify.success({ message: "Dispute submitted. We'll review it within 24-48 hours." });
			setSelectedOrder(null); setDisputeType(null); setReason(null); setDescription("");
		} catch (err) { notify.error({ message: "Could not submit", subtitle: getApiErrorMessage(err) }); }
	};

	return (
		<div>
			<h2 className="text-lg font-bold text-N900 mb-1">Returns & Refunds</h2>
			<p className="text-sm text-N400 mb-5">Open a dispute, request a return, or track refund status.</p>

			<div className="flex gap-0 border-b border-N30 mb-5">
				{([["disputes", `My Disputes (${disputes.length})`], ["eligible", `Orders (${eligibleOrders.length})`]] as const).map(([key, label]) => (
					<button key={key} onClick={() => setTab(key)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-BR500 text-N900" : "border-transparent text-N500 hover:text-N800"}`}>
						{label}
					</button>
				))}
			</div>

			<div className="flex gap-2 mb-6 max-w-lg">
				<div className="relative flex-1">
					<input type="text" placeholder="Search by order number" value={search} onChange={(e) => setSearch(e.target.value)}
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none pr-10" />
					<Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-N400" />
				</div>
			</div>

			{tab === "disputes" ? (
				loadingDisputes ? (
					<div className="text-N400 py-12 text-center">Loading…</div>
				) : (filtered as IDispute[] ?? disputes).length === 0 ? (
					<div className="text-center py-20 flex flex-col items-center gap-3">
						<RotateCcw size={48} className="text-N200" />
						<Typography color="N500" className="text-sm">No disputes yet.</Typography>
					</div>
				) : (
					<div className="divide-y divide-N20">
						{(filtered as IDispute[] ?? disputes).map((d) => (
							<div key={d._id} className="py-4 flex items-start gap-4">
								<div className="w-10 h-10 rounded bg-N10 border border-N30 grid place-items-center shrink-0">
									<RotateCcw size={16} className="text-N400" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${d.order._id}`} className="text-sm font-medium text-N800 hover:text-BR500">
											{d.order.orderNumber}
										</Link>
										<span className={`text-[11px] px-2 py-0.5 rounded font-medium ${statusCls[d.status]}`}>{statusLabel[d.status]}</span>
									</div>
									<div className="text-xs text-N400 capitalize">
										{d.type.replace(/_/g, " ")} · {d.reason} · {formatDate(d.createdAt)}
									</div>
									{d.resolution && <div className="text-xs text-G600 mt-1">Resolution: {d.resolution}</div>}
									{d.refundAmount && d.refundAmount > 0 && <div className="text-xs text-G600">Refunded: {money(d.refundAmount)}</div>}
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<button onClick={() => setChatDisputeId(d._id)}
										className="flex items-center gap-1 text-xs text-BR500 hover:text-BR400 font-medium">
										<MessageCircle size={12} /> Chat{d.messages.length > 1 ? ` (${d.messages.length})` : ""}
									</button>
								</div>
							</div>
						))}
					</div>
				)
			) : (
				(filtered as IOrder[] ?? eligibleOrders).length === 0 ? (
					<div className="text-center py-20 flex flex-col items-center gap-3">
						<Package size={48} className="text-N200" />
						<Typography color="N500" className="text-sm">No eligible orders.</Typography>
					</div>
				) : (
					<div className="divide-y divide-N20">
						{(filtered as IOrder[] ?? eligibleOrders).map((o) => {
							const dispute = orderDisputeMap.get(o._id);
							const hasOpenDispute = dispute && (dispute.status === "open" || dispute.status === "under_review");
							return (
								<div key={o._id} className="py-4 flex items-start gap-4">
									<div className="flex -space-x-1.5 shrink-0 mt-0.5">
										{o.items.slice(0, 2).map((it, i) => (
											<div key={i} className="w-10 h-10 rounded bg-N10 border border-N30 overflow-hidden relative">
												{it.image ? <Image src={it.image} alt={it.name} fill className="object-cover" /> : (
													<div className="w-full h-full grid place-items-center"><Package size={12} className="text-N300" /></div>
												)}
											</div>
										))}
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2">
											<Link href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${o._id}`} className="text-sm font-medium text-N800 hover:text-BR500">
												{o.orderNumber}
											</Link>
											{o.paymentStatus === "refunded" && (
												<span className="text-[11px] px-2 py-0.5 rounded font-medium bg-G50 text-G600">Refunded</span>
											)}
											{dispute && (
												<span className={`text-[11px] px-2 py-0.5 rounded font-medium ${statusCls[dispute.status]}`}>{statusLabel[dispute.status]}</span>
											)}
										</div>
										<div className="text-xs text-N400">
											{o.items.length} item{o.items.length === 1 ? "" : "s"} · {money(o.grandTotal)} · {formatDate(o.createdAt)}
										</div>
									</div>
									<div className="shrink-0">
										{dispute ? (
											<button onClick={() => setChatDisputeId(dispute._id)}
												className="flex items-center gap-1 text-sm text-BR500 hover:text-BR400 font-medium">
												<MessageCircle size={13} /> View Dispute
											</button>
										) : o.paymentStatus !== "refunded" ? (
											<button onClick={() => setSelectedOrder(o)} className="text-sm text-BR500 hover:underline font-medium">
												Open Dispute
											</button>
										) : null}
									</div>
								</div>
							);
						})}
					</div>
				)
			)}

			{/* Open Dispute Modal */}
			<Modal isOpen={!!selectedOrder} closeModal={() => setSelectedOrder(null)} title="Open a Dispute" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setSelectedOrder(null)}>Cancel</Button>
					<Button variant="brown-light" loading={creating} onClick={submitDispute}>Submit Dispute</Button>
				</div>}>
				{selectedOrder && (
					<div className="p-6 flex flex-col gap-5">
						<div className="flex items-center gap-3 pb-4 border-b border-N30">
							<div className="flex -space-x-1">
								{selectedOrder.items.slice(0, 2).map((it, i) => (
									<div key={i} className="w-10 h-10 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
										{it.image ? <Image src={it.image} alt={it.name} fill className="object-cover" /> : (
											<div className="w-full h-full grid place-items-center"><Package size={12} className="text-N300" /></div>
										)}
									</div>
								))}
							</div>
							<div>
								<div className="text-sm font-medium text-N800">{selectedOrder.orderNumber}</div>
								<div className="text-xs text-N400">{selectedOrder.items.length} item{selectedOrder.items.length === 1 ? "" : "s"} · {money(selectedOrder.grandTotal)}</div>
							</div>
						</div>
						<SMSelectDropDown label="Dispute type" placeholder="Select type" options={DISPUTE_TYPES} value={disputeType} onChange={(val: OptionType) => setDisputeType(val)} />
						<SMSelectDropDown label="Reason" placeholder="Select a reason" options={REASON_OPTIONS} value={reason} onChange={(val: OptionType) => setReason(val)} />
						<TextField name="description" label="Details (optional)" inputType="textarea" placeholder="Describe the issue…"
							value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
						<div className="bg-N10 border border-N30 rounded p-3 text-xs text-N500 leading-relaxed">
							Disputes are reviewed within 24-48 hours. If approved, refunds are processed to the original payment method within 5-10 business days.
						</div>
					</div>
				)}
			</Modal>

			{/* Dispute Chat Modal */}
			<Modal isOpen={!!chatDisputeId} closeModal={() => setChatDisputeId(null)} title="Dispute" mobileLayoutType="normal">
				{chatDisputeId && <div className="px-6 pb-6"><DisputeChat disputeId={chatDisputeId} onClose={() => setChatDisputeId(null)} /></div>}
			</Modal>
		</div>
	);
};

export default ReturnsPage;
