"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Search } from "lucide-react";
import { Typography } from "@/components";
import { useGetMyOrdersQuery, type IOrder } from "@/redux/api/orders";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const statusLabel = (o: IOrder) => {
	if (o.status === "cancelled") return { text: "Cancelled", cls: "bg-R50 text-R500 border-R100", dot: "bg-R400" };
	if (o.paymentStatus === "refunded") return { text: "Refunded", cls: "bg-G50 text-G600 border-G100", dot: "bg-G500" };
	if (o.fulfillmentStatus === "delivered") return { text: "Delivered", cls: "bg-G50 text-G600 border-G100", dot: "bg-G500" };
	if (o.fulfillmentStatus === "shipped") return { text: "Shipped", cls: "bg-B50 text-B600 border-B100", dot: "bg-B500" };
	if (o.status === "processing") return { text: "Processing", cls: "bg-B50 text-B600 border-B100", dot: "bg-B500" };
	if (o.paymentStatus === "paid") return { text: "Paid", cls: "bg-G50 text-G600 border-G100", dot: "bg-G500" };
	if (o.paymentStatus === "failed") return { text: "Failed", cls: "bg-R50 text-R500 border-R100", dot: "bg-R400" };
	return { text: "Pending", cls: "bg-O50 text-O600 border-O100", dot: "bg-O500" };
};

type Tab = "all" | "active" | "completed" | "cancelled";

const TABS: { key: Tab; label: string }[] = [
	{ key: "all", label: "View all" },
	{ key: "active", label: "Active" },
	{ key: "completed", label: "Completed" },
	{ key: "cancelled", label: "Cancelled" },
];

const filterOrders = (orders: IOrder[], tab: Tab) => {
	switch (tab) {
		case "active":
			return orders.filter((o) => o.status !== "cancelled" && o.fulfillmentStatus !== "delivered");
		case "completed":
			return orders.filter((o) => o.fulfillmentStatus === "delivered");
		case "cancelled":
			return orders.filter((o) => o.status === "cancelled");
		default:
			return orders;
	}
};

const OrderRow = ({ order }: { order: IOrder }) => {
	const badge = statusLabel(order);
	return (
		<Link
			href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${order._id}`}
			className="flex items-center gap-4 py-4 hover:bg-N10 -mx-2 px-2 rounded transition-colors"
		>
			{/* Thumbnails */}
			<div className="flex -space-x-1.5 shrink-0">
				{order.items.slice(0, 3).map((it, i) => (
					<div key={i} className="w-12 h-12 rounded bg-N10 border border-N30 overflow-hidden relative">
						{it.image ? (
							<Image src={it.image} alt={it.name} fill className="object-cover" />
						) : (
							<div className="w-full h-full grid place-items-center">
								<Package size={14} className="text-N300" />
							</div>
						)}
					</div>
				))}
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<div className="text-sm font-medium text-N800">{order.orderNumber}</div>
				<div className="text-xs text-N400 mt-0.5">
					{order.items.length} item{order.items.length === 1 ? "" : "s"} ·{" "}
					{new Date(order.createdAt).toLocaleDateString("en-GB", {
						day: "numeric",
						month: "short",
						year: "numeric",
					})}
				</div>
			</div>

			{/* Status + total */}
			<div className="flex flex-col items-end gap-1 shrink-0">
				<span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border font-medium ${badge.cls}`}>
					<span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
					{badge.text}
				</span>
				<span className="text-sm font-semibold text-N800">{money(order.grandTotal)}</span>
			</div>
		</Link>
	);
};

const MyOrders = () => {
	const [tab, setTab] = useState<Tab>("all");
	const [search, setSearch] = useState("");
	const { data, isLoading } = useGetMyOrdersQuery({ pageSize: 50 });

	const allOrders: IOrder[] = data?.data.data ?? [];
	const tabOrders = filterOrders(allOrders, tab);
	const orders = search.trim()
		? tabOrders.filter(
				(o) =>
					o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
					o.items.some((it) => it.name.toLowerCase().includes(search.toLowerCase())),
			)
		: tabOrders;

	if (isLoading) return <div className="text-N400 py-12 text-center">Loading…</div>;

	return (
		<div>
			{/* Tabs */}
			<div className="flex gap-0 border-b border-N30 mb-5">
				{TABS.map((t) => (
					<button
						key={t.key}
						onClick={() => setTab(t.key)}
						className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
							tab === t.key
								? "border-BR500 text-N900"
								: "border-transparent text-N500 hover:text-N800"
						}`}
					>
						{t.label}
					</button>
				))}
			</div>

			{/* Search */}
			<div className="flex gap-2 mb-6 max-w-lg">
				<div className="relative flex-1">
					<input
						type="text"
						placeholder="Order ID, product or store name"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none pr-10"
					/>
					<Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-N400" />
				</div>
			</div>

			{/* List */}
			{orders.length === 0 ? (
				<div className="text-center py-20 flex flex-col items-center gap-3">
					<Package size={48} className="text-N200" />
					<Typography color="N500" className="text-sm">
						{search ? `No orders matching "${search}"` : "No orders yet"}
					</Typography>
					{!search && (
						<Link href="/shop" className="text-sm text-BR500 hover:underline font-medium">
							Start shopping
						</Link>
					)}
				</div>
			) : (
				<div className="divide-y divide-N20">
					{orders.map((o) => (
						<OrderRow key={o._id} order={o} />
					))}
				</div>
			)}
		</div>
	);
};

export default MyOrders;
