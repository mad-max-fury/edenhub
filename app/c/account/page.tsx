"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
	ArrowRight,
	Camera,
	ChevronRight,
	Clock,
	Heart,
	Loader2,
	Package,
	Pencil,
	RotateCcw,
	Star,
	Truck,
	User,
	Wallet,
} from "lucide-react";
import { Button, Typography, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import { useUploadReviewImageMutation } from "@/redux/api/shopReviews";
import { getApiErrorMessage } from "@/utils/helpers";
import { useGetMeQuery, useUpdateMeMutation } from "@/redux/api/auth";
import { useGetMyOrdersQuery } from "@/redux/api/orders";
import { useGetWishlistQuery } from "@/redux/api/wishlist";
import { AuthRouteConfig } from "@/constants/routes";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;

const AccountOverview = () => {
	const { data, isLoading } = useGetMeQuery();
	const [updateMe, { isLoading: saving }] = useUpdateMeMutation();
	const { data: ordersData } = useGetMyOrdersQuery({ pageSize: 50 });
	const { data: wishlistData } = useGetWishlistQuery();

	const user = data?.data;
	const orders = ordersData?.data.data ?? [];
	const recentOrders = orders.slice(0, 3);
	const savedCount = wishlistData?.data?.length ?? 0;

	const unpaid = orders.filter((o) => o.paymentStatus === "pending" && o.status !== "cancelled").length;
	const toShip = orders.filter((o) => o.paymentStatus === "paid" && o.fulfillmentStatus === "unfulfilled").length;
	const shipped = orders.filter((o) => o.fulfillmentStatus === "shipped").length;
	const delivered = orders.filter((o) => o.fulfillmentStatus === "delivered").length;
	const returned = orders.filter((o) => o.fulfillmentStatus === "returned" || o.paymentStatus === "refunded").length;

	const [uploadImage, { isLoading: uploading }] = useUploadReviewImageMutation();
	const fileRef = useRef<HTMLInputElement>(null);
	const [editing, setEditing] = useState(false);
	const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "", country: "", state: "", city: "" });

	const startEdit = () => {
		setForm({
			firstName: user?.firstName ?? "",
			lastName: user?.lastName ?? "",
			phoneNumber: user?.phoneNumber ?? "",
			country: user?.country ?? "",
			state: user?.state ?? "",
			city: user?.city ?? "",
		});
		setEditing(true);
	};

	const saveProfile = async () => {
		try {
			await updateMe(form).unwrap();
			notify.success({ message: "Profile updated" });
			setEditing(false);
		} catch (err) {
			notify.error({ message: "Update failed", subtitle: getApiErrorMessage(err) });
		}
	};

	const onPickProfilePic = async (file: File) => {
		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await uploadImage(fd).unwrap();
			await updateMe({ profilePicture: res.data.url }).unwrap();
			notify.success({ message: "Profile picture updated" });
		} catch (err) {
			notify.error({ message: "Upload failed", subtitle: getApiErrorMessage(err) });
		}
	};

	if (isLoading) return <div className="text-N400 py-12 text-center">Loading…</div>;

	const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

	return (
		<div>
			{/* User card */}
			<div className="flex items-center gap-4 pb-6 border-b border-N30">
				<button
					type="button"
					onClick={() => fileRef.current?.click()}
					className="w-16 h-16 rounded-full bg-N10 border border-N30 grid place-items-center text-lg font-bold text-N500 shrink-0 relative overflow-hidden group"
				>
					{user?.profilePicture ? (
						<Image src={user.profilePicture} alt="" fill className="object-cover" />
					) : (
						initials || <User size={24} />
					)}
					<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
						{uploading ? <Loader2 size={16} className="text-white animate-spin" /> : <Camera size={16} className="text-white" />}
					</div>
				</button>
				<input ref={fileRef} type="file" accept="image/*" className="hidden"
					onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickProfilePic(f); e.target.value = ""; }} />
				<div className="flex-1 min-w-0">
					<h2 className="text-xl font-bold text-N900">
						{user?.firstName} {user?.lastName}
					</h2>
					<div className="text-sm text-N400 mt-0.5">{user?.email}</div>
				</div>
				<button
					onClick={startEdit}
					className="text-sm text-N500 hover:text-N800 flex items-center gap-1"
				>
					<Pencil size={13} /> Edit
				</button>
			</div>

			{/* Quick links row */}
			<div className="grid grid-cols-2 sm:grid-cols-4 border-b border-N30">
				{[
					{ icon: <Heart size={22} />, label: "Wish List", count: savedCount, href: AuthRouteConfig.ACCOUNT_SAVED },
					{ icon: <Clock size={22} />, label: "Viewed", href: AuthRouteConfig.ACCOUNT_RECENTLY_VIEWED },
					{ icon: <Star size={22} />, label: "Reviews", href: AuthRouteConfig.ACCOUNT_REVIEWS },
					{ icon: <Wallet size={22} />, label: "Addresses", href: AuthRouteConfig.ACCOUNT_ADDRESSES },
				].map((item) => (
					<Link
						key={item.label}
						href={item.href}
						className="flex flex-col items-center gap-2 py-5 sm:py-6 hover:bg-N10 transition-colors text-N500 hover:text-N800"
					>
						{item.icon}
						<span className="text-xs text-N600">{item.label}</span>
					</Link>
				))}
			</div>

			{/* My Orders section */}
			<div className="pt-6">
				<div className="flex items-center justify-between mb-5">
					<h3 className="text-[17px] font-bold text-N900">My Orders</h3>
					<Link
						href={AuthRouteConfig.ACCOUNT_ORDERS}
						className="flex items-center gap-1 text-sm text-N400 hover:text-N800"
					>
						View All <ChevronRight size={14} />
					</Link>
				</div>

				{/* Order status icons */}
				<div className="grid grid-cols-2 sm:grid-cols-4 border border-N30 rounded mb-5">
					{[
						{ icon: <Wallet size={24} strokeWidth={1.5} />, label: "Unpaid", count: unpaid, href: AuthRouteConfig.ACCOUNT_ORDERS },
						{ icon: <Package size={24} strokeWidth={1.5} />, label: "To be shipped", count: toShip, href: AuthRouteConfig.ACCOUNT_ORDERS },
						{ icon: <Truck size={24} strokeWidth={1.5} />, label: "Shipped", count: shipped, href: AuthRouteConfig.ACCOUNT_TRACK_ORDER },
						{ icon: <Star size={24} strokeWidth={1.5} />, label: "To be reviewed", count: delivered, href: AuthRouteConfig.ACCOUNT_REVIEWS },
					].map((item) => (
						<Link
							key={item.label}
							href={item.href}
							className="flex flex-col items-center gap-1.5 py-5 hover:bg-N10 transition-colors relative"
						>
							<span className="text-BR500">{item.icon}</span>
							{item.count > 0 && (
								<span className="absolute top-2.5 right-1/2 translate-x-5 bg-R500 text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full grid place-items-center">
									{item.count}
								</span>
							)}
							<span className="text-[11px] sm:text-xs text-N600 text-center">{item.label}</span>
						</Link>
					))}
				</div>

				{/* Action rows */}
				<div className="border border-N30 rounded divide-y divide-N30 mb-6">
					<Link
						href={AuthRouteConfig.ACCOUNT_RETURNS}
						className="flex items-center justify-between px-5 py-3.5 hover:bg-N10 transition-colors"
					>
						<div className="flex items-center gap-3">
							<RotateCcw size={18} className="text-N500" />
							<span className="text-sm text-N800">Returns & Refunds</span>
							{returned > 0 && (
								<span className="text-[11px] bg-O50 text-O600 px-2 py-0.5 rounded font-medium">{returned}</span>
							)}
						</div>
						<ChevronRight size={16} className="text-N300" />
					</Link>
					<Link
						href={AuthRouteConfig.ACCOUNT_TRACK_ORDER}
						className="flex items-center justify-between px-5 py-3.5 hover:bg-N10 transition-colors"
					>
						<div className="flex items-center gap-3">
							<Truck size={18} className="text-N500" />
							<span className="text-sm text-N800">Track Order</span>
						</div>
						<ChevronRight size={16} className="text-N300" />
					</Link>
				</div>
			</div>

			{/* Recent orders */}
			{recentOrders.length > 0 && (
				<div>
					<div className="flex items-center justify-between border-b border-N30 pb-3 mb-0">
						<h3 className="text-[15px] font-bold text-N900">Recent Orders</h3>
						<Link
							href={AuthRouteConfig.ACCOUNT_ORDERS}
							className="flex items-center gap-1 text-[13px] text-N400 hover:text-N800"
						>
							View all <ArrowRight size={13} />
						</Link>
					</div>
					<div className="divide-y divide-N20">
						{recentOrders.map((o) => (
							<Link
								key={o._id}
								href={`${AuthRouteConfig.ACCOUNT_ORDER_DETAIL}/${o._id}`}
								className="flex items-center gap-3 sm:gap-4 py-3.5 hover:bg-N10 -mx-2 px-2 rounded transition-colors"
							>
								<div className="hidden sm:flex -space-x-1.5">
									{o.items.slice(0, 3).map((it, i) => (
										<div key={i} className="w-10 h-10 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
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
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-sm font-medium text-N800">{o.orderNumber}</span>
										<span
											className={`text-[10px] px-1.5 py-0.5 rounded capitalize font-medium sm:hidden ${
												o.status === "cancelled" ? "bg-R50 text-R500"
													: o.fulfillmentStatus === "delivered" ? "bg-G50 text-G600"
														: o.fulfillmentStatus === "shipped" ? "bg-B50 text-B600"
															: "bg-O50 text-O600"
											}`}
										>
											{o.fulfillmentStatus === "shipped" ? "Shipped"
												: o.fulfillmentStatus === "delivered" ? "Delivered"
													: o.status}
										</span>
									</div>
									<div className="text-xs text-N400">
										{new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {o.items.length} item{o.items.length === 1 ? "" : "s"}
									</div>
								</div>
								<div className="flex flex-col items-end gap-1 shrink-0">
									<span
										className={`hidden sm:inline text-[11px] px-2 py-0.5 rounded capitalize font-medium ${
											o.status === "cancelled" ? "bg-R50 text-R500"
												: o.fulfillmentStatus === "delivered" ? "bg-G50 text-G600"
													: o.fulfillmentStatus === "shipped" ? "bg-B50 text-B600"
														: "bg-O50 text-O600"
										}`}
									>
										{o.fulfillmentStatus === "shipped" ? "Shipped"
											: o.fulfillmentStatus === "delivered" ? "Delivered"
												: o.status}
									</span>
									<span className="text-sm font-semibold text-N800">{money(o.grandTotal)}</span>
								</div>
							</Link>
						))}
					</div>
				</div>
			)}

			{/* Edit Profile Modal */}
			<Modal
				isOpen={editing}
				closeModal={() => setEditing(false)}
				title="Edit Profile"
				mobileLayoutType="normal"
				footerData={
					<div className="flex gap-3 justify-end">
						<Button variant="gold" onClick={() => setEditing(false)}>Cancel</Button>
						<Button variant="brown-light" loading={saving} onClick={saveProfile}>Save</Button>
					</div>
				}
			>
				<div className="p-6 grid sm:grid-cols-2 gap-4">
					{([
						["firstName", "First name"],
						["lastName", "Last name"],
						["phoneNumber", "Phone number"],
						["country", "Country"],
						["state", "State / Region"],
						["city", "City"],
					] as const).map(([key, label]) => (
						<div key={key}>
							<label className="text-xs text-N500 mb-1 block">{label}</label>
							<input
								value={(form as Record<string, string>)[key]}
								onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
								placeholder={label}
								className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none"
							/>
						</div>
					))}
				</div>
			</Modal>
		</div>
	);
};

export default AccountOverview;
