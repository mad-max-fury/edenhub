"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { MapPin, Pencil, Plus, Shield, Trash2, Truck } from "lucide-react";
import { Button, Footer, GlobalMenu, Typography, notify } from "@/components";
import { useAuthModal } from "@/components/authModal/AuthModal";
import { Modal } from "@/components/modal/modal";
import { cookieValues } from "@/constants/data";
import { getApiErrorMessage } from "@/utils/helpers";
import { useGetCartQuery } from "@/redux/api/cart";
import {
	useAddAddressMutation,
	useDeleteAddressMutation,
	useUpdateAddressMutation,
	useGetAddressesQuery,
	type IAddress,
	type IAddressPayload,
} from "@/redux/api/account";
import {
	useCreateOrderMutation,
	useFetchRatesMutation,
	type ICourierRate,
	type IReceiverAddress,
} from "@/redux/api/orders";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;
const ORDER_KEY = "edenhub_pending_order";

const blankForm: IAddressPayload = {
	firstName: "", lastName: "", phone: "", additionalPhone: "",
	address: "", landmark: "", city: "", state: "", country: "Nigeria", postalCode: "", isDefault: false,
};

const AddressFormModal = ({ isOpen, onClose, onSave, saving, initial, title }: {
	isOpen: boolean; onClose: () => void; onSave: (data: IAddressPayload) => void; saving: boolean;
	initial?: IAddressPayload; title?: string;
}) => {
	const [form, setForm] = useState<IAddressPayload>(initial ?? blankForm);
	useEffect(() => { if (isOpen) setForm(initial ?? blankForm); }, [isOpen, initial]);
	const set = (key: keyof IAddressPayload, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));
	const handleSave = () => {
		if (!form.firstName || !form.lastName || !form.phone || !form.address || !form.city || !form.state) {
			notify.error({ message: "Please fill all required fields" }); return;
		}
		onSave(form);
	};
	const field = (key: keyof IAddressPayload, label: string, opts?: { span2?: boolean; required?: boolean }) => (
		<div className={opts?.span2 ? "sm:col-span-2" : ""}>
			<label className="text-xs text-N500 block mb-1">{label} {opts?.required && <span className="text-R400">*</span>}</label>
			<input placeholder={label} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)}
				className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
		</div>
	);
	return (
		<Modal isOpen={isOpen} closeModal={onClose} title={title || "Add Delivery Address"} mobileLayoutType="normal"
			footerData={<div className="flex gap-3 justify-end">
				<Button variant="gold" onClick={onClose}>Cancel</Button>
				<Button variant="brown-light" loading={saving} onClick={handleSave}>Save</Button>
			</div>}>
			<div className="p-6 grid sm:grid-cols-2 gap-4">
				{field("firstName", "First Name", { required: true })}
				{field("lastName", "Last Name", { required: true })}
				{field("phone", "Phone", { required: true })}
				{field("additionalPhone", "Additional Phone")}
				{field("address", "Address", { span2: true, required: true })}
				{field("landmark", "Landmark", { span2: true })}
				{field("country", "Country", { required: true })}
				{field("state", "Region (State)", { required: true })}
				{field("city", "City", { required: true })}
				{field("postalCode", "Postal / Zip Code")}
				<div className="sm:col-span-2">
					<label className="flex items-center gap-2 cursor-pointer">
						<input type="checkbox" checked={!!form.isDefault} onChange={(e) => set("isDefault", e.target.checked)} className="w-4 h-4 accent-BR500" />
						<span className="text-sm text-N600">Set as default address</span>
					</label>
				</div>
			</div>
		</Modal>
	);
};

const toReceiver = (a: IAddress): IReceiverAddress => ({
	firstName: a.firstName, lastName: a.lastName, fullName: a.fullName || `${a.firstName} ${a.lastName}`,
	phone: a.phone, additionalPhone: a.additionalPhone, address: a.address, landmark: a.landmark,
	city: a.city, state: a.state, country: a.country, postalCode: a.postalCode,
});

const toPayload = (a: IAddress): IAddressPayload => {
	let firstName = a.firstName || "";
	let lastName = a.lastName || "";
	if (!firstName && !lastName && a.fullName) {
		const parts = a.fullName.trim().split(/\s+/);
		firstName = parts[0] || "";
		lastName = parts.slice(1).join(" ") || "";
	}
	return {
		firstName, lastName, phone: a.phone, additionalPhone: a.additionalPhone,
		address: a.address, landmark: a.landmark, city: a.city, state: a.state, country: a.country,
		postalCode: a.postalCode, isDefault: a.isDefault,
	};
};

const CheckoutPage = () => {
	const router = useRouter();
	const { requireAuth } = useAuthModal();
	const isLoggedIn = !!getCookie(cookieValues.token);

	const { data: cartRes } = useGetCartQuery(undefined, { skip: !isLoggedIn });
	const { data: addrRes } = useGetAddressesQuery(undefined, { skip: !isLoggedIn });

	const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
	const [updateAddress, { isLoading: updatingAddress }] = useUpdateAddressMutation();
	const [deleteAddress] = useDeleteAddressMutation();
	const [fetchRates, { isLoading: fetchingRates }] = useFetchRatesMutation();
	const [createOrder, { isLoading: placing }] = useCreateOrderMutation();

	const cart = cartRes?.data;
	const addresses = addrRes?.data ?? [];

	const [selectedAddressId, setSelectedAddressId] = useState("");
	const [showAddForm, setShowAddForm] = useState(false);
	const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
	const [showAddressPicker, setShowAddressPicker] = useState(false);
	const [couriers, setCouriers] = useState<ICourierRate[]>([]);
	const [requestToken, setRequestToken] = useState("");
	const [courier, setCourier] = useState<ICourierRate | null>(null);
	const [agreeTerms, setAgreeTerms] = useState(false);
	const [agreeReturns, setAgreeReturns] = useState(false);
	const [paymentProvider, setPaymentProvider] = useState<"paystack" | "stripe">("paystack");
	const [ratesFailed, setRatesFailed] = useState(false);

	const selectedAddress = useMemo(
		() => addresses.find((a) => a._id === selectedAddressId) || addresses.find((a) => a.isDefault) || addresses[0],
		[addresses, selectedAddressId],
	);
	const items = useMemo(
		() => (cart?.items ?? []).map((it) => ({
			product: it.product, variantId: it.variantId, quantity: it.quantity,
			engraving: it.engraving ? { font: it.engraving.font, lines: it.engraving.lines } : undefined,
		})),
		[cart],
	);

	const saveNewAddress = async (data: IAddressPayload) => {
		try {
			const res = await addAddress(data).unwrap();
			const created = res.data[res.data.length - 1];
			setSelectedAddressId(created._id);
			setShowAddForm(false);
			notify.success({ message: "Address saved" });
		} catch (err) { notify.error({ message: "Could not save", subtitle: getApiErrorMessage(err) }); }
	};
	const saveEditAddress = async (data: IAddressPayload) => {
		if (!editingAddress) return;
		try {
			await updateAddress({ id: editingAddress._id, data }).unwrap();
			setEditingAddress(null);
			notify.success({ message: "Address updated" });
		} catch (err) { notify.error({ message: "Could not update", subtitle: getApiErrorMessage(err) }); }
	};
	const removeAddress = async (id: string) => {
		try {
			await deleteAddress(id).unwrap();
			if (selectedAddressId === id) setSelectedAddressId("");
			notify.success({ message: "Address removed" });
		} catch (err) { notify.error({ message: "Could not remove", subtitle: getApiErrorMessage(err) }); }
	};
	const loadRates = async () => {
		if (!selectedAddress || items.length === 0) return;
		setRatesFailed(false);
		try {
			const res = await fetchRates({ receiver: toReceiver(selectedAddress), items }).unwrap();
			setCouriers(res.data.couriers);
			setRequestToken(res.data.requestToken);
			setCourier(null);
		} catch { setCouriers([]); setCourier(null); setRatesFailed(true); }
	};

	useEffect(() => { loadRates(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [selectedAddress?._id, items.length]);

	const placeOrder = async () => {
		if (!agreeTerms || !agreeReturns) return notify.error({ message: "Please accept the policies" });
		if (!selectedAddress) return notify.error({ message: "Select a delivery address" });
		if (!courier) return notify.error({ message: "Select a delivery option" });
		try {
			const res = await createOrder({
				items, shippingAddress: toReceiver(selectedAddress),
				selectedCourier: { courierId: courier.courierId, courierName: courier.courierName, courierLogo: courier.courierLogo, serviceCode: courier.serviceCode, requestToken, amount: courier.amount },
				paymentProvider,
			}).unwrap();
			const order = res.data;
			localStorage.setItem(ORDER_KEY, order._id);
			if (order.paymentAuthorizationUrl) window.location.href = order.paymentAuthorizationUrl;
			else router.push(`/checkout/callback?orderId=${order._id}`);
		} catch (err) { notify.error({ message: "Could not place order", subtitle: getApiErrorMessage(err) }); }
	};

	if (!isLoggedIn) {
		return (<>
			<GlobalMenu />
			<div className="h-[60vh] grid place-items-center text-center">
				<div>
					<Typography color="N500" className="mb-4">Sign in to check out.</Typography>
					<Button variant="brown-light" onClick={() => requireAuth(() => router.refresh())}>Sign in</Button>
				</div>
			</div>
			<Footer />
		</>);
	}

	const shippingFee = courier?.amount ?? 0;
	const subtotal = cart?.subtotal ?? 0;
	const total = subtotal + shippingFee;
	const canPay = agreeTerms && agreeReturns && !!selectedAddress && !!courier;

	return (
		<>
			<GlobalMenu />
			<main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8 min-h-[60vh]">
				<h1 className="text-xl font-bold text-N900 mb-6">Checkout</h1>

				{!cart || cart.items.length === 0 ? (
					<div className="text-center py-20">
						<Typography color="N500" className="mb-4">Your cart is empty.</Typography>
						<Button variant="brown-light" onClick={() => router.push("/shop")}>Continue shopping</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
						{/* LEFT */}
						<div className="flex flex-col gap-6">

							{/* 1. Delivery Address */}
							<section>
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-sm font-semibold text-N900 uppercase tracking-wide">Delivery Address</h2>
									<button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 text-xs text-BR500 hover:text-BR400 font-medium">
										<Plus size={13} /> Add new
									</button>
								</div>
								{!selectedAddress ? (
									<div className="border border-dashed border-N30 rounded py-8 text-center">
										<MapPin size={22} className="text-N300 mx-auto mb-2" />
										<p className="text-sm text-N400">No delivery address selected.</p>
										<button onClick={() => addresses.length > 0 ? setShowAddressPicker(true) : setShowAddForm(true)} className="text-sm text-BR500 hover:underline font-medium mt-1">
											{addresses.length > 0 ? "Select address" : "Add address"}
										</button>
									</div>
								) : (
									<div className="border border-BR400 bg-BR50/20 rounded p-4">
										<div className="flex items-start justify-between gap-3">
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<MapPin size={14} className="text-BR500 shrink-0" />
													<span className="text-sm font-medium text-N900">
														{selectedAddress.fullName || `${selectedAddress.firstName} ${selectedAddress.lastName}`}
													</span>
													{selectedAddress.isDefault && <span className="text-[10px] bg-G50 text-G600 px-1.5 py-0.5 rounded font-medium">Default</span>}
												</div>
												<div className="text-xs text-N500 ml-[22px]">{selectedAddress.phone}</div>
												<div className="text-xs text-N400 ml-[22px] mt-0.5">
													{selectedAddress.address}{selectedAddress.landmark ? ` (${selectedAddress.landmark})` : ""}, {selectedAddress.city}, {selectedAddress.state}
												</div>
											</div>
											<button onClick={() => setEditingAddress(selectedAddress)} className="text-N400 hover:text-N700 shrink-0" aria-label="Edit address">
												<Pencil size={13} />
											</button>
										</div>
										{addresses.length > 1 && (
											<div className="mt-3 ml-[22px]">
												<button onClick={() => setShowAddressPicker(true)} className="text-xs text-BR500 hover:text-BR400 font-medium">
													Change address
												</button>
											</div>
										)}
									</div>
								)}
							</section>

							{/* 2. Items */}
							<section>
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-sm font-semibold text-N900 uppercase tracking-wide">Items ({cart.items.length})</h2>
									<Link href="/cart" className="text-xs text-BR500 hover:text-BR400 font-medium flex items-center gap-1">
										<Pencil size={11} /> Edit cart
									</Link>
								</div>
								<div className="border border-N30 rounded divide-y divide-N20">
									{cart.items.map((it) => (
										<div key={it._id} className="flex items-center gap-3 p-3">
											<div className="w-11 h-11 rounded bg-N10 overflow-hidden shrink-0 relative">
												{it.image && <Image src={it.image} alt={it.name} fill className="object-cover" />}
											</div>
											<div className="flex-1 min-w-0">
												<span className="text-sm text-N700 truncate block">{it.name}</span>
												<span className="text-xs text-N400">Qty {it.quantity}{it.engraving?.lines?.length ? " · Engraved" : ""}</span>
											</div>
											<span className="text-sm text-N600 shrink-0">{money(it.lineTotal)}</span>
										</div>
									))}
								</div>
							</section>

							{/* 3. Shipping */}
							<section>
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-sm font-semibold text-N900 uppercase tracking-wide">Shipping</h2>
									{couriers.length > 0 && (
										<button onClick={loadRates} className="text-xs text-N400 hover:text-N600 font-medium">Refresh</button>
									)}
								</div>
								{fetchingRates ? (
									<div className="border border-N30 rounded p-4">
										<div className="flex flex-col gap-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-N10 rounded animate-pulse" />)}</div>
										<p className="text-xs text-N400 text-center mt-3">Fetching delivery options…</p>
									</div>
								) : !selectedAddress ? (
									<div className="border border-dashed border-N30 rounded py-6 text-center">
										<Truck size={22} className="text-N300 mx-auto mb-2" />
										<p className="text-sm text-N400">Select a delivery address first.</p>
									</div>
								) : ratesFailed ? (
									<div className="border border-R100 rounded py-6 text-center">
										<p className="text-sm text-N700">Could not load shipping options</p>
										<p className="text-xs text-N400 mt-0.5">Check your address or try again.</p>
										<button onClick={loadRates} className="mt-2 text-sm text-BR500 hover:underline font-medium">Try again</button>
									</div>
								) : couriers.length === 0 ? (
									<div className="border border-dashed border-N30 rounded py-6 text-center">
										<Truck size={22} className="text-N300 mx-auto mb-2" />
										<p className="text-sm text-N600">No shipping options for this address.</p>
										<button onClick={loadRates} className="mt-2 text-sm text-BR500 hover:underline font-medium">Retry</button>
									</div>
								) : (
									<div className="border border-N30 rounded divide-y divide-N20">
										{couriers.map((c) => {
											const active = courier?.serviceCode === c.serviceCode;
											return (
												<button key={`${c.courierId}-${c.serviceCode}`} onClick={() => setCourier(c)}
													className={`flex items-center gap-3 p-3 w-full text-left transition-colors ${active ? "bg-BR50/20" : "hover:bg-N10"}`}>
													<div className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${active ? "border-BR500" : "border-N200"}`}>
														{active && <div className="w-1.5 h-1.5 rounded-full bg-BR500" />}
													</div>
													{c.courierLogo ? (
														<div className="w-7 h-7 rounded bg-white border border-N20 overflow-hidden shrink-0 relative">
															<Image src={c.courierLogo} alt={c.courierName} fill className="object-contain p-0.5" />
														</div>
													) : (
														<div className="w-7 h-7 rounded bg-N10 shrink-0 grid place-items-center"><Truck size={12} className="text-N400" /></div>
													)}
													<div className="flex-1 min-w-0">
														<span className="text-sm text-N700">{c.courierName}</span>
														{c.deliveryEta && <span className="text-xs text-N400 block">{c.deliveryEta}</span>}
													</div>
													<span className="text-sm text-N600 shrink-0">{money(c.amount)}</span>
												</button>
											);
										})}
									</div>
								)}
							</section>
						</div>

						{/* RIGHT — sticky sidebar */}
						<div className="lg:sticky lg:top-6 flex flex-col gap-4">
							{/* Summary */}
							<div className="border border-N30 rounded p-5">
								<h3 className="text-sm font-semibold text-N900 mb-4">Order Summary</h3>
								<div className="flex flex-col gap-2 text-sm">
									<div className="flex justify-between"><span className="text-N400">Subtotal ({cart.count} items)</span><span className="text-N700">{money(subtotal)}</span></div>
									<div className="flex justify-between"><span className="text-N400">Shipping</span><span className="text-N700">{courier ? money(shippingFee) : "—"}</span></div>
									<div className="flex justify-between font-semibold border-t border-N20 pt-3 mt-1">
										<span className="text-N900">Total</span><span className="text-N900">{money(total)}</span>
									</div>
								</div>
							</div>

							{/* Payment */}
							<div className="border border-N30 rounded p-5">
								<h3 className="text-sm font-semibold text-N900 mb-3">Payment</h3>
								<div className="flex flex-col gap-2">
									{([
										{ id: "paystack" as const, label: "Paystack", desc: "Cards, bank transfer, USSD",
											logo: (<svg viewBox="0 0 28 28" className="w-full h-full"><rect width="28" height="28" rx="5" fill="#00C3F7"/><path d="M6 7.5h16v2H6zm0 3.5h16v2H6zm0 3.5h11v2H6zm0 3.5h6v2H6z" fill="#fff"/></svg>) },
										{ id: "stripe" as const, label: "Stripe", desc: "Visa, Mastercard (International)",
											logo: (<svg viewBox="0 0 28 28" className="w-full h-full"><rect width="28" height="28" rx="5" fill="#635BFF"/><path d="M13 10.5c0-.6.5-.8 1.2-.8 1.1 0 2.5.3 3.6.9V7c-1.2-.5-2.4-.7-3.6-.7-3 0-5 1.5-5 4.1 0 4 5.5 3.4 5.5 5.1 0 .7-.6.9-1.5.9-1.2 0-2.8-.5-4.1-1.2v3.6c1.4.6 2.8.8 4.1.8 3 0 5-1.5 5-4.1 0-4.3-5.2-3.5-5.2-5z" fill="#fff"/></svg>) },
									]).map((pm) => (
										<button key={pm.id} onClick={() => setPaymentProvider(pm.id)}
											className={`flex items-center gap-2.5 p-3 border rounded text-left transition-colors ${
												paymentProvider === pm.id ? "border-BR500 bg-BR50/20" : "border-N30 hover:border-N100"
											}`}>
											<div className={`w-4 h-4 rounded-full border-2 grid place-items-center shrink-0 ${paymentProvider === pm.id ? "border-BR500" : "border-N200"}`}>
												{paymentProvider === pm.id && <div className="w-1.5 h-1.5 rounded-full bg-BR500" />}
											</div>
											<div className="w-7 h-7 shrink-0">{pm.logo}</div>
											<div className="flex-1 min-w-0">
												<span className={`text-sm ${paymentProvider === pm.id ? "text-N900" : "text-N600"}`}>{pm.label}</span>
												<span className="text-[11px] text-N400 block">{pm.desc}</span>
											</div>
										</button>
									))}
								</div>
							</div>

							{/* Policies + CTA */}
							<div className="border border-N30 rounded p-5">
								<label className="flex items-start gap-2 cursor-pointer">
									<input type="checkbox" checked={agreeTerms} onChange={() => setAgreeTerms((v) => !v)} className="w-3.5 h-3.5 accent-BR500 mt-0.5 shrink-0" />
									<span className="text-xs text-N500 leading-relaxed">I agree to the Terms & Conditions and Privacy Policy.</span>
								</label>
								<label className="flex items-start gap-2 cursor-pointer mt-2">
									<input type="checkbox" checked={agreeReturns} onChange={() => setAgreeReturns((v) => !v)} className="w-3.5 h-3.5 accent-BR500 mt-0.5 shrink-0" />
									<span className="text-xs text-N500 leading-relaxed">I agree to the Return Policy and refund terms.</span>
								</label>

								<Button variant="brown-light" className="w-full mt-4" loading={placing} disabled={!canPay} onClick={placeOrder}>
									Pay {money(total)}
								</Button>

								<div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-N400">
									<Shield size={11} />
									<span>Secure checkout · SSL encrypted</span>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
			<Footer />

			{/* Add address modal */}
			<AddressFormModal isOpen={showAddForm} onClose={() => setShowAddForm(false)} onSave={saveNewAddress} saving={addingAddress} />

			{/* Edit address modal */}
			<AddressFormModal
				isOpen={!!editingAddress}
				onClose={() => setEditingAddress(null)}
				onSave={saveEditAddress}
				saving={updatingAddress}
				initial={editingAddress ? toPayload(editingAddress) : undefined}
				title="Edit Address"
			/>

			{/* Address picker modal */}
			<Modal
				isOpen={showAddressPicker}
				closeModal={() => setShowAddressPicker(false)}
				title="Select Address"
				mobileLayoutType="normal"
			>
				<div className="p-4 flex flex-col gap-2">
					{addresses.map((a) => {
						const active = (selectedAddress?._id ?? "") === a._id;
						const name = a.fullName || `${a.firstName} ${a.lastName}`;
						return (
							<button
								key={a._id}
								onClick={() => { setSelectedAddressId(a._id); setShowAddressPicker(false); }}
								className={`flex items-start gap-3 border rounded p-3.5 text-left transition-colors w-full ${
									active ? "border-BR400 bg-BR50/20" : "border-N30 hover:border-N100"
								}`}
							>
								<div className={`w-4 h-4 mt-0.5 rounded-full border-2 grid place-items-center shrink-0 ${active ? "border-BR500" : "border-N200"}`}>
									{active && <div className="w-1.5 h-1.5 rounded-full bg-BR500" />}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<span className="text-sm text-N800">{name}</span>
										{a.isDefault && <span className="text-[10px] bg-G50 text-G600 px-1.5 py-0.5 rounded font-medium">Default</span>}
									</div>
									<div className="text-xs text-N400 mt-0.5">{a.phone}</div>
									<div className="text-xs text-N400">{a.address}{a.landmark ? ` (${a.landmark})` : ""}, {a.city}, {a.state}</div>
								</div>
							</button>
						);
					})}
					<button
						onClick={() => { setShowAddressPicker(false); setShowAddForm(true); }}
						className="flex items-center justify-center gap-1.5 py-3 text-sm text-BR500 hover:text-BR400 font-medium border border-dashed border-N30 rounded hover:border-BR400 transition-colors"
					>
						<Plus size={14} /> Add new address
					</button>
				</div>
			</Modal>
		</>
	);
};

export default CheckoutPage;
