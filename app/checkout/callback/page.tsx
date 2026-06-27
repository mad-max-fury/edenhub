"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, Package, RefreshCw, ShoppingBag, XCircle } from "lucide-react";
import { Footer, GlobalMenu } from "@/components";
import { useClearCartMutation } from "@/redux/api/cart";
import { useVerifyMyOrderMutation, type IOrder } from "@/redux/api/orders";

const money = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;
const ORDER_KEY = "edenhub_pending_order";

type Phase = "verifying" | "paid" | "failed" | "pending" | "error";

const CheckoutCallback = () => {
	const router = useRouter();
	const [verifyOrder] = useVerifyMyOrderMutation();
	const [clearCart] = useClearCartMutation();

	const [phase, setPhase] = useState<Phase>("verifying");
	const [order, setOrder] = useState<IOrder | null>(null);
	const ran = useRef(false);

	useEffect(() => {
		if (ran.current) return;
		ran.current = true;

		const params = new URLSearchParams(window.location.search);
		const orderId = params.get("orderId") || params.get("reference") || localStorage.getItem(ORDER_KEY);

		if (!orderId) { setPhase("error"); return; }

		(async () => {
			try {
				const res = await verifyOrder(orderId).unwrap();
				setOrder(res.data);
				if (res.data.paymentStatus === "paid") {
					setPhase("paid");
					clearCart();
				} else if (res.data.paymentStatus === "failed") {
					setPhase("failed");
				} else {
					setPhase("pending");
				}
			} catch {
				setPhase("error");
			} finally {
				localStorage.removeItem(ORDER_KEY);
			}
		})();
	}, [verifyOrder, clearCart]);

	return (
		<>
			<GlobalMenu />
			<main className="max-w-[520px] mx-auto px-4 py-16 min-h-[60vh] flex flex-col items-center justify-center">

				{/* Verifying */}
				{phase === "verifying" && (
					<div className="text-center">
						<div className="w-16 h-16 rounded-full bg-N10 grid place-items-center mx-auto mb-5">
							<RefreshCw size={24} className="text-N400 animate-spin" />
						</div>
						<h1 className="text-xl font-bold text-N900 mb-2">Confirming payment…</h1>
						<p className="text-sm text-N500">Please wait while we verify your transaction.</p>
					</div>
				)}

				{/* Success */}
				{phase === "paid" && (
					<div className="text-center w-full">
						<div className="w-16 h-16 rounded-full bg-G50 grid place-items-center mx-auto mb-5">
							<CheckCircle2 size={28} className="text-G500" />
						</div>
						<h1 className="text-xl font-bold text-N900 mb-2">Order confirmed!</h1>
						<p className="text-sm text-N500 mb-6">Thank you for your purchase. A confirmation email is on its way.</p>

						{order && (
							<div className="border border-N30 rounded p-5 mb-6 text-left">
								<div className="flex items-center justify-between mb-3 pb-3 border-b border-N20">
									<span className="text-sm font-medium text-N900">{order.orderNumber}</span>
									<span className="text-[11px] px-2 py-0.5 rounded bg-G50 text-G600 font-medium">Paid</span>
								</div>
								<div className="flex justify-between text-sm mb-1.5">
									<span className="text-N400">Items</span>
									<span className="text-N700">{order.items.length}</span>
								</div>
								<div className="flex justify-between text-sm mb-1.5">
									<span className="text-N400">Shipping</span>
									<span className="text-N700">{money(order.shippingFee)}</span>
								</div>
								<div className="flex justify-between text-sm font-semibold border-t border-N20 pt-2 mt-2">
									<span className="text-N900">Total</span>
									<span className="text-N900">{money(order.grandTotal)}</span>
								</div>
							</div>
						)}

						<div className="flex gap-3">
							<Link href="/c/account/orders" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
								<Package size={15} /> View orders
							</Link>
							<Link href="/shop" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium border border-N30 text-N700 rounded hover:border-N200 transition-colors">
								<ShoppingBag size={15} /> Continue shopping
							</Link>
						</div>
					</div>
				)}

				{/* Failed */}
				{phase === "failed" && (
					<div className="text-center w-full">
						<div className="w-16 h-16 rounded-full bg-R50 grid place-items-center mx-auto mb-5">
							<XCircle size={28} className="text-R500" />
						</div>
						<h1 className="text-xl font-bold text-N900 mb-2">Payment failed</h1>
						<p className="text-sm text-N500 mb-6">Your payment was not successful. Your cart has been preserved — you can try again.</p>

						{order && (
							<div className="border border-R100 bg-R50/20 rounded p-4 mb-6 text-left">
								<div className="flex justify-between text-sm">
									<span className="text-N500">Order</span>
									<span className="font-mono text-N700">{order.orderNumber}</span>
								</div>
								<div className="flex justify-between text-sm mt-1">
									<span className="text-N500">Amount</span>
									<span className="text-N700">{money(order.grandTotal)}</span>
								</div>
							</div>
						)}

						<div className="flex gap-3">
							<Link href="/cart" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
								Try again
							</Link>
							<Link href="/shop" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium border border-N30 text-N700 rounded hover:border-N200 transition-colors">
								Continue shopping
							</Link>
						</div>
					</div>
				)}

				{/* Pending */}
				{phase === "pending" && (
					<div className="text-center w-full">
						<div className="w-16 h-16 rounded-full bg-O50 grid place-items-center mx-auto mb-5">
							<Clock size={28} className="text-O500" />
						</div>
						<h1 className="text-xl font-bold text-N900 mb-2">Payment pending</h1>
						<p className="text-sm text-N500 mb-6">Your payment hasn&apos;t been confirmed yet. If you were charged, it will update within a few minutes.</p>

						{order && (
							<div className="border border-O200 bg-O50/20 rounded p-4 mb-6 text-left">
								<div className="flex justify-between text-sm">
									<span className="text-N500">Order</span>
									<span className="font-mono text-N700">{order.orderNumber}</span>
								</div>
								<div className="flex justify-between text-sm mt-1">
									<span className="text-N500">Status</span>
									<span className="text-O600 font-medium">Awaiting confirmation</span>
								</div>
							</div>
						)}

						<div className="flex gap-3">
							<Link href="/c/account/orders" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
								<Package size={15} /> Check order status
							</Link>
							<Link href="/contact" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium border border-N30 text-N700 rounded hover:border-N200 transition-colors">
								Contact support
							</Link>
						</div>
					</div>
				)}

				{/* Error */}
				{phase === "error" && (
					<div className="text-center">
						<div className="w-16 h-16 rounded-full bg-R50 grid place-items-center mx-auto mb-5">
							<XCircle size={28} className="text-R500" />
						</div>
						<h1 className="text-xl font-bold text-N900 mb-2">Something went wrong</h1>
						<p className="text-sm text-N500 mb-6">We couldn&apos;t confirm this order. Please check your orders or contact support.</p>
						<div className="flex gap-3">
							<Link href="/c/account/orders" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium bg-BR500 text-white rounded hover:bg-BR400 transition-colors">
								My orders
							</Link>
							<Link href="/contact" className="flex-1 flex items-center justify-center gap-2 h-11 text-sm font-medium border border-N30 text-N700 rounded hover:border-N200 transition-colors">
								Contact support
							</Link>
						</div>
					</div>
				)}
			</main>
			<Footer />
		</>
	);
};

export default CheckoutCallback;
