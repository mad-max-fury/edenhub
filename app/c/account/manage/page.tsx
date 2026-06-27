"use client";

import React, { useState } from "react";
import { AlertTriangle, ChevronRight, KeyRound, Mail, Shield, Trash2 } from "lucide-react";
import { Button, Typography, notify, SMSelectDropDown } from "@/components";
import type { OptionType } from "@/components/smSelect/smSelect";
import { Modal } from "@/components/modal/modal";
import { getApiErrorMessage } from "@/utils/helpers";
import {
	useGetMeQuery,
	useChangePasswordMutation,
	useRequestAccountDeletionMutation,
	useCancelAccountDeletionMutation,
	useGetDeletionStatusQuery,
	useSetup2FAMutation,
	useEnable2FAMutation,
	useEnableEmail2FAMutation,
	useDisable2FAMutation,
} from "@/redux/api/auth";

const DELETE_REASONS: OptionType[] = [
	{ label: "I no longer need this account", value: "no-longer-needed" },
	{ label: "I have another account", value: "duplicate-account" },
	{ label: "Privacy concerns", value: "privacy" },
	{ label: "Too many emails/notifications", value: "too-many-emails" },
	{ label: "Bad experience", value: "bad-experience" },
	{ label: "Other", value: "other" },
];

const ManageAccount = () => {
	const { data } = useGetMeQuery();
	const [changePassword, { isLoading: changing }] = useChangePasswordMutation();
	const [setup2FA] = useSetup2FAMutation();
	const [enable2FA, { isLoading: enabling2FA }] = useEnable2FAMutation();
	const [enableEmail2FA, { isLoading: enablingEmail }] = useEnableEmail2FAMutation();
	const [disable2FA, { isLoading: disabling2FA }] = useDisable2FAMutation();
	const [requestDeletion, { isLoading: deleting }] = useRequestAccountDeletionMutation();
	const [cancelDeletion, { isLoading: cancelling }] = useCancelAccountDeletionMutation();
	const { data: deletionData, refetch: refetchDeletion } = useGetDeletionStatusQuery();
	const user = data?.data;
	const deletion = deletionData?.data;

	const [showPwd, setShowPwd] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [show2FAChoice, setShow2FAChoice] = useState(false);
	const [show2FA, setShow2FA] = useState(false);
	const [show2FADisable, setShow2FADisable] = useState(false);
	const [qrData, setQrData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
	const [totpCode, setTotpCode] = useState("");
	const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
	const [deleteReason, setDeleteReason] = useState<OptionType | null>(null);

	const maskedEmail = user?.email
		? user.email.replace(/^(.{1,2})(.*)(@.*)$/, (_, a, b, c) => `${a}${"*".repeat(Math.max(b.length, 4))}${c}`)
		: "—";

	const submitPassword = async () => {
		if (!pwd.currentPassword || !pwd.newPassword) { notify.error({ message: "Fill in all password fields" }); return; }
		if (pwd.newPassword !== pwd.confirmPassword) { notify.error({ message: "Passwords do not match" }); return; }
		try {
			await changePassword(pwd).unwrap();
			notify.success({ message: "Password changed" });
			setPwd({ currentPassword: "", newPassword: "", confirmPassword: "" });
			setShowPwd(false);
		} catch (err) { notify.error({ message: "Change failed", subtitle: getApiErrorMessage(err) }); }
	};

	const submitDelete = async () => {
		if (!deleteReason) { notify.error({ message: "Please select a reason" }); return; }
		try {
			await requestDeletion({ reason: String(deleteReason.value) }).unwrap();
			notify.success({ message: "Deletion requested. Your account will be deleted in 30 days." });
			setShowDelete(false);
			setDeleteReason(null);
			refetchDeletion();
		} catch (err) { notify.error({ message: "Could not process request", subtitle: getApiErrorMessage(err) }); }
	};

	const open2FASetup = async () => {
		try {
			const res = await setup2FA().unwrap();
			setQrData(res.data);
			setTotpCode("");
			setShow2FA(true);
		} catch (err) { notify.error({ message: "Could not setup 2FA", subtitle: getApiErrorMessage(err) }); }
	};

	const confirm2FA = async () => {
		if (totpCode.length !== 6) { notify.error({ message: "Enter a 6-digit code" }); return; }
		try {
			await enable2FA({ token: totpCode }).unwrap();
			notify.success({ message: "Two-factor authentication enabled" });
			setShow2FA(false);
			setQrData(null);
			setTotpCode("");
		} catch (err) { notify.error({ message: "Invalid code", subtitle: getApiErrorMessage(err) }); }
	};

	const confirmDisable2FA = async () => {
		const isAuth = user?.twoFactorMethod === "authenticator";
		if (isAuth && totpCode.length !== 6) { notify.error({ message: "Enter a 6-digit code" }); return; }
		try {
			await disable2FA(isAuth ? { token: totpCode } : {}).unwrap();
			notify.success({ message: "Two-factor authentication disabled" });
			setShow2FADisable(false);
			setTotpCode("");
		} catch (err) { notify.error({ message: "Failed", subtitle: getApiErrorMessage(err) }); }
	};

	const handleCancelDeletion = async () => {
		try {
			await cancelDeletion().unwrap();
			notify.success({ message: "Account deletion cancelled" });
			refetchDeletion();
		} catch (err) { notify.error({ message: "Could not cancel", subtitle: getApiErrorMessage(err) }); }
	};

	return (
		<div>
			<h2 className="text-lg font-bold text-N900 mb-1">Settings</h2>
			<p className="text-sm text-N400 mb-5">Manage your account security and preferences.</p>

			{/* Deletion pending banner */}
			{deletion?.requested && (
				<div className="border border-O200 bg-O50/30 rounded p-4 mb-5 flex items-start gap-3">
					<AlertTriangle size={18} className="text-O500 shrink-0 mt-0.5" />
					<div className="flex-1">
						<p className="text-sm font-medium text-N800">Account deletion scheduled</p>
						<p className="text-xs text-N500 mt-0.5">
							Your account will be permanently deleted on{" "}
							<span className="font-medium text-N700">
								{new Date(deletion.scheduledDeletionDate!).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
							</span>{" "}
							({deletion.daysRemaining} days remaining).
						</p>
						<button onClick={handleCancelDeletion} disabled={cancelling}
							className="mt-3 px-4 py-2 text-sm font-medium text-white bg-BR500 rounded hover:bg-BR400 transition-colors disabled:opacity-50">
							{cancelling ? "Cancelling…" : "Cancel deletion — Keep my account"}
						</button>
					</div>
				</div>
			)}

			<div className="border border-N30 rounded divide-y divide-N30">
				{/* Email */}
				<div className="flex items-center justify-between px-5 py-4 gap-4">
					<div className="flex items-center gap-3.5">
						<span className="text-N400"><Mail size={16} /></span>
						<div>
							<div className="text-sm font-medium text-N800">Email Address</div>
							<div className="text-[13px] text-N400 mt-0.5">{maskedEmail}</div>
						</div>
					</div>
				</div>

				{/* Password */}
				<div className="flex items-center justify-between px-5 py-4 gap-4">
					<div className="flex items-center gap-3.5">
						<span className="text-N400"><KeyRound size={16} /></span>
						<div>
							<div className="text-sm font-medium text-N800">Change Password</div>
							<div className="text-[13px] text-N400 mt-0.5">Update your account password</div>
						</div>
					</div>
					<button onClick={() => setShowPwd(true)} className="text-sm text-BR500 hover:text-BR400 font-medium">Change</button>
				</div>

				{/* 2FA */}
				<div className="flex items-center justify-between px-5 py-4 gap-4">
					<div className="flex items-center gap-3.5">
						<span className="text-N400"><Shield size={16} /></span>
						<div>
							<div className="text-sm font-medium text-N800">Two-Factor Authentication</div>
							<div className="text-[13px] text-N400 mt-0.5">
								{user?.twoFactorEnabled
									? `Enabled via ${user.twoFactorMethod === "authenticator" ? "authenticator app" : "email OTP"}`
									: "Add extra security to your account"}
							</div>
						</div>
					</div>
					{user?.twoFactorEnabled ? (
						<button onClick={() => { setTotpCode(""); setShow2FADisable(true); }} className="text-sm text-R500 hover:text-R400 font-medium">Disable</button>
					) : (
						<button onClick={() => setShow2FAChoice(true)} className="text-sm text-BR500 hover:text-BR400 font-medium">Enable</button>
					)}
				</div>

				{/* Delete account */}
				<div className="flex items-center justify-between px-5 py-4 gap-4">
					<div className="flex items-center gap-3.5">
						<span className={deletion?.requested ? "text-O500" : "text-R400"}><Trash2 size={16} /></span>
						<div>
							<div className={`text-sm font-medium ${deletion?.requested ? "text-O600" : "text-R500"}`}>
								{deletion?.requested ? "Deletion Requested" : "Delete Account"}
							</div>
							<div className="text-[13px] text-N400 mt-0.5">
								{deletion?.requested
									? `Scheduled for ${new Date(deletion.scheduledDeletionDate!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · ${deletion.daysRemaining} days left`
									: "Permanently delete your account and data"}
							</div>
						</div>
					</div>
					{deletion?.requested ? (
						<span className="text-[11px] bg-O50 text-O600 px-2 py-1 rounded font-medium">Pending</span>
					) : (
						<button onClick={() => setShowDelete(true)} className="text-sm text-R500 hover:text-R400 font-medium">Delete</button>
					)}
				</div>
			</div>

			{/* Change Password Modal */}
			<Modal isOpen={showPwd} closeModal={() => setShowPwd(false)} title="Change Password" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShowPwd(false)}>Cancel</Button>
					<Button variant="brown-light" loading={changing} onClick={submitPassword}>Update Password</Button>
				</div>}>
				<div className="p-6 flex flex-col gap-4">
					{([["currentPassword", "Current password"], ["newPassword", "New password"], ["confirmPassword", "Confirm new password"]] as const).map(([key, label]) => (
						<div key={key}>
							<label className="text-xs text-N500 mb-1 block">{label}</label>
							<input type="password" placeholder={label} value={(pwd as Record<string, string>)[key]}
								onChange={(e) => setPwd((p) => ({ ...p, [key]: e.target.value }))}
								className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
						</div>
					))}
				</div>
			</Modal>

			{/* Delete Account Modal */}
			<Modal isOpen={showDelete} closeModal={() => setShowDelete(false)} title="Delete Account" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShowDelete(false)}>Cancel</Button>
					<Button variant="brown-light" loading={deleting} onClick={submitDelete} className="!bg-R500 !hover:bg-R400">Delete my account</Button>
				</div>}>
				<div className="p-6 flex flex-col gap-5">
					<div className="bg-R50 border border-R100 rounded p-4">
						<div className="flex items-start gap-3">
							<AlertTriangle size={18} className="text-R500 shrink-0 mt-0.5" />
							<div>
								<p className="text-sm font-medium text-R600">This action has a 30-day grace period</p>
								<p className="text-xs text-N500 mt-1 leading-relaxed">
									After requesting deletion, your account will remain active for 30 days. During this time you can cancel the request and keep your account.
									After 30 days, your account and all associated data will be permanently deleted and cannot be recovered.
								</p>
							</div>
						</div>
					</div>

					<SMSelectDropDown
						label="Why are you leaving?"
						placeholder="Select a reason"
						options={DELETE_REASONS}
						value={deleteReason}
						onChange={(val: OptionType) => setDeleteReason(val)}
					/>

					<p className="text-xs text-N400">
						You cannot delete your account if you have pending orders. Please complete or cancel them first.
					</p>
				</div>
			</Modal>
		{/* 2FA Method Choice Modal */}
			<Modal isOpen={show2FAChoice} closeModal={() => setShow2FAChoice(false)} title="Enable two-factor authentication" mobileLayoutType="normal">
				<div className="p-6 flex flex-col gap-3">
					<p className="text-sm text-N500 mb-2">Choose your preferred verification method:</p>
					<button onClick={async () => {
						setShow2FAChoice(false);
						try { await enableEmail2FA().unwrap(); notify.success({ message: "Email OTP enabled" }); }
						catch (err) { notify.error({ message: "Failed", subtitle: getApiErrorMessage(err) }); }
					}} disabled={enablingEmail}
						className="flex items-start gap-3 p-4 border border-N30 rounded hover:border-BR400 hover:bg-BR50/10 transition-colors text-left">
						<div className="w-10 h-10 rounded bg-B50 grid place-items-center shrink-0 mt-0.5">
							<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
						</div>
						<div>
							<div className="text-sm font-medium text-N800">Email OTP</div>
							<div className="text-xs text-N400 mt-0.5">We&apos;ll send a verification code to your email each time you log in.</div>
						</div>
					</button>
					<button onClick={() => { setShow2FAChoice(false); open2FASetup(); }}
						className="flex items-start gap-3 p-4 border border-N30 rounded hover:border-BR400 hover:bg-BR50/10 transition-colors text-left">
						<div className="w-10 h-10 rounded bg-BR50 grid place-items-center shrink-0 mt-0.5">
							<Shield size={18} className="text-BR500" />
						</div>
						<div>
							<div className="text-sm font-medium text-N800">Authenticator app</div>
							<div className="text-xs text-N400 mt-0.5">Use Google Authenticator, Authy, or any TOTP app to generate codes.</div>
						</div>
					</button>
				</div>
			</Modal>

		{/* 2FA Setup Modal */}
			<Modal isOpen={show2FA} closeModal={() => setShow2FA(false)} title="Enable Two-Factor Authentication" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShow2FA(false)}>Cancel</Button>
					<Button variant="brown-light" loading={enabling2FA} onClick={confirm2FA}>Verify & Enable</Button>
				</div>}>
				<div className="p-6 flex flex-col gap-5">
					{qrData && (
						<>
							<p className="text-sm text-N500">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.):</p>
							<div className="flex justify-center">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img src={qrData.qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
							</div>
							<div className="bg-N10 border border-N30 rounded p-3 text-center">
								<p className="text-[10px] text-N400 mb-1">Or enter this code manually:</p>
								<p className="text-sm font-mono font-medium text-N800 tracking-wider select-all">{qrData.secret}</p>
							</div>
							<div>
								<label className="text-xs text-N500 mb-1 block">Enter the 6-digit code from your app</label>
								<input value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
									placeholder="000000" maxLength={6}
									className="w-full border border-N40 rounded px-3 py-2.5 text-center text-lg font-mono tracking-[0.5em] focus:border-BR400 outline-none" />
							</div>
						</>
					)}
				</div>
			</Modal>

			{/* 2FA Disable Modal */}
			<Modal isOpen={show2FADisable} closeModal={() => setShow2FADisable(false)} title="Disable Two-Factor Authentication" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShow2FADisable(false)}>Cancel</Button>
					<Button variant="brown-light" loading={disabling2FA} onClick={confirmDisable2FA} className="!bg-R500 !hover:bg-R400">Disable 2FA</Button>
				</div>}>
				<div className="p-6 flex flex-col gap-4">
					{user?.twoFactorMethod === "authenticator" ? (
						<>
							<p className="text-sm text-N500">Enter the 6-digit code from your authenticator app to confirm.</p>
							<input value={totpCode} onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
								placeholder="000000" maxLength={6}
								className="w-full border border-N40 rounded px-3 py-2.5 text-center text-lg font-mono tracking-[0.5em] focus:border-BR400 outline-none" />
						</>
					) : (
						<p className="text-sm text-N500">Are you sure you want to disable email OTP? You&apos;ll no longer need a code to log in.</p>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default ManageAccount;
