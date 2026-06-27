"use client";

import React, { useState } from "react";
import { MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { Button, Typography, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import { getApiErrorMessage } from "@/utils/helpers";
import {
	useGetAddressesQuery,
	useAddAddressMutation,
	useUpdateAddressMutation,
	useDeleteAddressMutation,
	useSetDefaultAddressMutation,
	type IAddressPayload,
} from "@/redux/api/account";

const blank: IAddressPayload = {
	firstName: "", lastName: "", phone: "", additionalPhone: "",
	address: "", landmark: "", city: "", state: "", country: "Nigeria", postalCode: "", isDefault: false,
};

const AddressBook = () => {
	const { data, isLoading } = useGetAddressesQuery();
	const [addAddress, { isLoading: adding }] = useAddAddressMutation();
	const [updateAddress, { isLoading: updating }] = useUpdateAddressMutation();
	const [deleteAddress] = useDeleteAddressMutation();
	const [setDefault] = useSetDefaultAddressMutation();

	const addresses = data?.data ?? [];
	const [editingId, setEditingId] = useState<string | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [form, setForm] = useState<IAddressPayload>(blank);

	const openNew = () => { setForm(blank); setEditingId(null); setShowForm(true); };
	const openEdit = (id: string) => {
		const a = addresses.find((x) => x._id === id);
		if (!a) return;
		let fn = a.firstName || "", ln = a.lastName || "";
		if (!fn && !ln && a.fullName) { const p = a.fullName.trim().split(/\s+/); fn = p[0] || ""; ln = p.slice(1).join(" ") || ""; }
		setForm({ firstName: fn, lastName: ln, phone: a.phone, additionalPhone: a.additionalPhone, address: a.address, landmark: a.landmark, city: a.city, state: a.state, country: a.country, postalCode: a.postalCode, isDefault: a.isDefault });
		setEditingId(id); setShowForm(true);
	};

	const save = async () => {
		if (!form.firstName || !form.lastName || !form.phone || !form.address || !form.city || !form.state) { notify.error({ message: "Please fill all required fields" }); return; }
		try {
			if (editingId) { await updateAddress({ id: editingId, data: form }).unwrap(); notify.success({ message: "Address updated" }); }
			else { await addAddress(form).unwrap(); notify.success({ message: "Address added" }); }
			setShowForm(false);
		} catch (err) { notify.error({ message: "Save failed", subtitle: getApiErrorMessage(err) }); }
	};

	const wrap = async (fn: () => Promise<unknown>, msg: string) => {
		try { await fn(); notify.success({ message: msg }); }
		catch (err) { notify.error({ message: "Action failed", subtitle: getApiErrorMessage(err) }); }
	};

	const set = (key: keyof IAddressPayload, value: string | boolean) => setForm((f) => ({ ...f, [key]: value }));

	const field = (key: keyof IAddressPayload, label: string, opts?: { span2?: boolean; required?: boolean }) => (
		<div className={opts?.span2 ? "sm:col-span-2" : ""}>
			<label className="text-xs text-N500 block mb-1">{label} {opts?.required && <span className="text-R400">*</span>}</label>
			<input placeholder={label} value={String(form[key] ?? "")} onChange={(e) => set(key, e.target.value)} className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
		</div>
	);

	if (isLoading) return <div className="text-N400 py-12 text-center">Loading…</div>;

	return (
		<div>
			<div className="flex items-center justify-between mb-5">
				<h2 className="text-lg font-bold text-N900">Shipping Address</h2>
				<button onClick={openNew} className="flex items-center gap-1.5 text-sm text-BR500 hover:text-BR400 font-medium">
					<Plus size={14} /> Add address
				</button>
			</div>

			{addresses.length === 0 ? (
				<div className="text-center py-20 flex flex-col items-center gap-3">
					<MapPin size={48} className="text-N200" />
					<Typography color="N500" className="text-sm">No saved addresses yet.</Typography>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{addresses.map((a) => {
						const name = a.fullName || `${a.firstName} ${a.lastName}`;
						return (
							<div key={a._id} className="border border-N30 rounded p-4">
								<div className="flex items-center justify-between mb-2.5">
									<div className="flex items-center gap-2">
										{a.isDefault ? (
											<span className="text-[11px] bg-G50 text-G600 px-2 py-0.5 rounded font-medium">Default</span>
										) : (
											<button onClick={() => wrap(() => setDefault(a._id).unwrap(), "Default updated")} className="text-[11px] text-BR500 hover:underline font-medium">
												Set as default
											</button>
										)}
									</div>
									<div className="flex items-center gap-3">
										<button onClick={() => openEdit(a._id)} className="text-N400 hover:text-N700" aria-label="Edit"><Pencil size={13} /></button>
										<button onClick={() => wrap(() => deleteAddress(a._id).unwrap(), "Address removed")} className="text-R400 hover:text-R500" aria-label="Delete"><Trash2 size={13} /></button>
									</div>
								</div>
								<div className="text-sm font-medium text-N800">{name}</div>
								<div className="text-sm text-N500 mt-0.5">{a.phone}{a.additionalPhone ? ` · ${a.additionalPhone}` : ""}</div>
								<div className="text-sm text-N500 mt-1">{a.address}{a.landmark ? ` (${a.landmark})` : ""}{`, ${a.city}, ${a.state}, ${a.country}`}{a.postalCode ? ` ${a.postalCode}` : ""}</div>
							</div>
						);
					})}
				</div>
			)}

			<Modal
				isOpen={showForm}
				closeModal={() => setShowForm(false)}
				title={editingId ? "Edit Address" : "Add Address"}
				mobileLayoutType="normal"
				footerData={
					<div className="flex gap-3 justify-end">
						<Button variant="gold" onClick={() => setShowForm(false)}>Cancel</Button>
						<Button variant="brown-light" loading={adding || updating} onClick={save}>{editingId ? "Update" : "Save"}</Button>
					</div>
				}
			>
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
		</div>
	);
};

export default AddressBook;
