"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie, getCookies } from "cookies-next";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button, Footer, GlobalMenu, Typography, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import { useGetMeQuery, useGetDeletionStatusQuery, useCancelAccountDeletionMutation } from "@/redux/api/auth";
import { AuthRouteConfig } from "@/constants/routes";
import { cookieValues } from "@/constants/data";
import { getApiErrorMessage } from "@/utils/helpers";

type NavItem = { label: string; href: string };

const NAV_SECTIONS: NavItem[][] = [
	[
		{ label: "Overview", href: AuthRouteConfig.ACCOUNT },
		{ label: "Orders", href: AuthRouteConfig.ACCOUNT_ORDERS },
		{ label: "Track Order", href: AuthRouteConfig.ACCOUNT_TRACK_ORDER },
		{ label: "Returns/Refunds", href: AuthRouteConfig.ACCOUNT_RETURNS },
	],
	[
		{ label: "Saved Items", href: AuthRouteConfig.ACCOUNT_SAVED },
		{ label: "Recently Viewed", href: AuthRouteConfig.ACCOUNT_RECENTLY_VIEWED },
		{ label: "Reviews", href: AuthRouteConfig.ACCOUNT_REVIEWS },
	],
	[
		{ label: "Settings", href: AuthRouteConfig.ACCOUNT_MANAGE },
		{ label: "Shipping Address", href: AuthRouteConfig.ACCOUNT_ADDRESSES },
		{ label: "Message Center", href: AuthRouteConfig.ACCOUNT_MESSAGES },
	],
];

const ALL_ITEMS = NAV_SECTIONS.flat();

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const token = getCookie(cookieValues.token);
	useGetMeQuery(undefined, { skip: !token });
	const { data: deletionData } = useGetDeletionStatusQuery(undefined, { skip: !token });
	const [cancelDeletion, { isLoading: cancelling }] = useCancelAccountDeletionMutation();
	const deletion = deletionData?.data;
	const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
	const [showKeepConfirm, setShowKeepConfirm] = useState(false);

	useEffect(() => {
		if (!token) router.replace(`${AuthRouteConfig.LOGIN}?returnTo=${encodeURIComponent(pathname)}`);
	}, [token, router, pathname]);

	if (!token) return null;

	const logout = () => {
		Object.keys(getCookies()).forEach((k) => deleteCookie(k));
		router.push(AuthRouteConfig.HOME);
	};

	const isActive = (href: string) =>
		pathname === href ||
		(href !== AuthRouteConfig.ACCOUNT && pathname.startsWith(href));

	return (
		<>
			<GlobalMenu />
			<div className="min-h-[80vh] bg-white">
				<main className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
					{/* Breadcrumb */}
					<nav className="text-xs text-N400 mb-5 flex items-center gap-1.5">
						<Link href="/" className="hover:text-N700">Home</Link>
						<span>{">"}</span>
						<Link href={AuthRouteConfig.ACCOUNT} className="hover:text-N700">Account</Link>
						{pathname !== AuthRouteConfig.ACCOUNT && (
							<>
								<span>{">"}</span>
								<span className="text-N700">
									{ALL_ITEMS.find((i) => isActive(i.href))?.label ?? ""}
								</span>
							</>
						)}
					</nav>

					{/* Mobile nav — above content on small screens */}
					<div className="lg:hidden overflow-x-auto hideScrollBar -mx-4 px-4 mb-4 border-b border-N20">
						<div className="flex gap-0 min-w-max">
							{ALL_ITEMS.map((item) => {
								const active = isActive(item.href);
								return (
									<Link
										key={item.href}
										href={item.href}
										className={`px-3 py-2.5 text-[13px] whitespace-nowrap border-b-2 transition-colors ${
											active
												? "border-BR500 text-N900 font-semibold"
												: "border-transparent text-N500 hover:text-N800"
										}`}
									>
										{item.label}
									</Link>
								);
							})}
							<button
								onClick={() => setShowLogoutConfirm(true)}
								className="px-3 py-2.5 text-[13px] whitespace-nowrap border-b-2 border-transparent text-N500 hover:text-R500 flex items-center gap-1"
							>
								<LogOut size={12} /> Log out
							</button>
						</div>
					</div>

					<div className="flex gap-0 items-start">
						{/* Sidebar — desktop only */}
						<aside className="hidden lg:block w-[220px] shrink-0 pr-8 border-r border-N30 sticky top-20">
							<Typography fontWeight="bold" className="text-lg mb-4">
								Account
							</Typography>

							{NAV_SECTIONS.map((section, si) => (
								<div
									key={si}
									className={si < NAV_SECTIONS.length - 1 ? "mb-2 pb-2 border-b border-N20" : "mb-2"}
								>
									{section.map((item) => {
										const active = isActive(item.href);
										return (
											<Link
												key={item.href}
												href={item.href}
												className={`block py-[7px] text-[14px] transition-colors border-l-[3px] pl-3 -ml-px ${
													active
														? "border-BR500 text-N900 font-semibold"
														: "border-transparent text-N600 hover:text-N900"
												}`}
											>
												{item.label}
											</Link>
										);
									})}
								</div>
							))}

							<div className="pt-2 border-t border-N20">
								<button
									onClick={() => setShowLogoutConfirm(true)}
									className="block py-[7px] text-[14px] text-N600 hover:text-R500 transition-colors border-l-[3px] border-transparent pl-3 -ml-px w-full text-left"
								>
									Log out
								</button>
							</div>
						</aside>

						{/* Content */}
						<section className="flex-1 lg:pl-8 min-w-0 min-h-[500px]">
							{deletion?.requested && (
								<div className="border border-O200 bg-O50/30 rounded p-3.5 mb-5 flex items-start gap-3">
									<AlertTriangle size={16} className="text-O500 shrink-0 mt-0.5" />
									<div className="flex-1 min-w-0">
										<p className="text-sm text-N800">
											Your account is scheduled for deletion on{" "}
											<span className="font-medium">
												{new Date(deletion.scheduledDeletionDate!).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
											</span>{" "}
											({deletion.daysRemaining} days left).
										</p>
									</div>
									<button
										onClick={() => setShowKeepConfirm(true)}
										className="text-sm text-BR500 hover:text-BR400 font-medium shrink-0"
									>
										Keep account
									</button>
								</div>
							)}
							{children}
						</section>
					</div>
				</main>
			</div>
			<Footer />

			{/* Logout confirmation */}
			<Modal isOpen={showLogoutConfirm} closeModal={() => setShowLogoutConfirm(false)} title="Log out" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShowLogoutConfirm(false)}>Cancel</Button>
					<Button variant="brown-light" onClick={logout} className="!bg-R500 !hover:bg-R400">Log out</Button>
				</div>}>
				<div className="p-6">
					<p className="text-sm text-N600">Are you sure you want to log out? You&apos;ll need to sign in again to access your account.</p>
				</div>
			</Modal>

			{/* Keep account confirmation */}
			<Modal isOpen={showKeepConfirm} closeModal={() => setShowKeepConfirm(false)} title="Cancel account deletion" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShowKeepConfirm(false)}>Go back</Button>
					<Button variant="brown-light" loading={cancelling} onClick={async () => {
						try { await cancelDeletion().unwrap(); notify.success({ message: "Your account has been restored" }); setShowKeepConfirm(false); }
						catch (err) { notify.error({ message: "Failed", subtitle: getApiErrorMessage(err) }); }
					}}>Yes, keep my account</Button>
				</div>}>
				<div className="p-6">
					<p className="text-sm text-N600">This will cancel your account deletion request. Your account and all data will be kept as-is.</p>
				</div>
			</Modal>
		</>
	);
};

export default AccountLayout;
