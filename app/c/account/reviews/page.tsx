"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Camera, ImagePlus, Loader2, Star, Package, X } from "lucide-react";
import { Button, Typography, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import { getApiErrorMessage } from "@/utils/helpers";
import { useGetMyReviewsQuery, useCreateReviewMutation } from "@/redux/api/reviews";
import { useUploadReviewImageMutation } from "@/redux/api/shopReviews";

const StarPick = ({ value, onSelect, size = 16 }: { value: number; onSelect?: (v: number) => void; size?: number }) => (
	<div className="flex gap-0.5">
		{Array.from({ length: 5 }).map((_, i) => (
			<button key={i} type={onSelect ? "button" : undefined} disabled={!onSelect} onClick={() => onSelect?.(i + 1)} className={onSelect ? "cursor-pointer" : "cursor-default"}>
				<Star size={size} className={i < value ? "fill-amber-400 text-amber-400" : "text-N100"} />
			</button>
		))}
	</div>
);

const ProductReviewsPage = () => {
	const { data, isLoading } = useGetMyReviewsQuery();
	const [createReview, { isLoading: submitting }] = useCreateReviewMutation();
	const [uploadImage, { isLoading: uploading }] = useUploadReviewImageMutation();

	const [tab, setTab] = useState<"pending" | "reviewed">("pending");
	const [activeProduct, setActiveProduct] = useState<{ id: string; name: string; image?: string } | null>(null);
	const [rating, setRating] = useState(0);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const fileRef = useRef<HTMLInputElement>(null);

	const pending = data?.data.pending ?? [];
	const reviewed = data?.data.reviewed ?? [];

	const openReview = (productId: string, name: string, image?: string) => {
		setActiveProduct({ id: productId, name, image });
		setRating(0); setTitle(""); setComment(""); setImages([]);
	};

	const onPickImage = async (file: File) => {
		if (images.length >= 5) { notify.error({ message: "Maximum 5 images" }); return; }
		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await uploadImage(fd).unwrap();
			setImages((prev) => [...prev, res.data.url]);
		} catch (err) {
			notify.error({ message: "Upload failed", subtitle: getApiErrorMessage(err) });
		}
	};

	const removeImage = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

	const submit = async () => {
		if (!activeProduct) return;
		if (!rating) { notify.error({ message: "Please select a rating" }); return; }
		if (!title.trim()) { notify.error({ message: "Please add a title" }); return; }
		if (!comment.trim()) { notify.error({ message: "Please write your review" }); return; }
		if (images.length === 0) { notify.error({ message: "Please add at least one photo" }); return; }
		try {
			await createReview({ product: activeProduct.id, rating, title, comment, images }).unwrap();
			notify.success({ message: "Review submitted" });
			setActiveProduct(null);
		} catch (err) {
			notify.error({ message: "Could not submit", subtitle: getApiErrorMessage(err) });
		}
	};

	if (isLoading) return <div className="text-N400 py-12 text-center">Loading…</div>;

	return (
		<div>
			<h2 className="text-lg font-bold text-N900 mb-5">Reviews</h2>

			{/* Tabs */}
			<div className="flex gap-0 border-b border-N30 mb-5">
				{([["pending", `Pending (${pending.length})`], ["reviewed", `Reviewed (${reviewed.length})`]] as const).map(([key, label]) => (
					<button key={key} onClick={() => setTab(key)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? "border-BR500 text-N900" : "border-transparent text-N500 hover:text-N800"}`}>
						{label}
					</button>
				))}
			</div>

			{tab === "pending" ? (
				pending.length === 0 ? (
					<div className="text-center py-20 flex flex-col items-center gap-3">
						<Star size={48} className="text-N200" />
						<Typography color="N500" className="text-sm">No products awaiting your review.</Typography>
					</div>
				) : (
					<div className="divide-y divide-N20">
						{pending.map((p) => (
							<div key={p.product} className="flex items-center gap-4 py-4">
								<div className="w-12 h-12 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
									{p.image ? <Image src={p.image} alt={p.name} fill className="object-cover" /> : <div className="w-full h-full grid place-items-center"><Package size={14} className="text-N300" /></div>}
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-N800">{p.name}</div>
									<div className="text-xs text-N400">{p.orderNumber}</div>
								</div>
								<span className="text-[11px] bg-G50 text-G600 px-2 py-0.5 rounded font-medium shrink-0">Delivered</span>
								<button onClick={() => openReview(p.product, p.name, p.image)} className="text-sm text-BR500 hover:underline font-medium shrink-0">Review</button>
							</div>
						))}
					</div>
				)
			) : reviewed.length === 0 ? (
				<div className="text-center py-20 flex flex-col items-center gap-3">
					<Star size={48} className="text-N200" />
					<Typography color="N500" className="text-sm">You haven&apos;t reviewed any products yet.</Typography>
				</div>
			) : (
				<div className="divide-y divide-N20">
					{reviewed.map((r) => {
						const product = typeof r.product === "string" ? { name: "Product", coverImage: undefined } : r.product;
						return (
							<div key={r._id} className="flex gap-4 py-4">
								<div className="w-12 h-12 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
									{product.coverImage ? <Image src={product.coverImage} alt="" fill className="object-cover" /> : <div className="w-full h-full grid place-items-center"><Package size={14} className="text-N300" /></div>}
								</div>
								<div className="flex-1">
									<div className="flex items-start justify-between gap-2">
										<span className="text-sm font-medium text-N800">{product.name}</span>
										<span className="text-xs text-N400 shrink-0">{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
									</div>
									<StarPick value={r.rating} size={12} />
									<div className="text-sm font-medium text-N800 mt-1">{r.title}</div>
									<div className="text-sm text-N500">{r.comment}</div>
									{r.images && r.images.length > 0 && (
										<div className="flex gap-2 mt-2">
											{r.images.map((img, i) => (
												<div key={i} className="w-14 h-14 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
													<Image src={img} alt="" fill className="object-cover" />
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Write Review Modal */}
			<Modal
				isOpen={!!activeProduct}
				closeModal={() => setActiveProduct(null)}
				title="Write a Review"
				mobileLayoutType="normal"
				footerData={
					<div className="flex gap-3 justify-end">
						<Button variant="gold" onClick={() => setActiveProduct(null)}>Cancel</Button>
						<Button variant="brown-light" loading={submitting} onClick={submit}>Submit</Button>
					</div>
				}
			>
				<div className="p-6 flex flex-col gap-5">
					{activeProduct && (
						<div className="flex items-center gap-3 pb-4 border-b border-N30">
							<div className="w-12 h-12 rounded bg-N10 border border-N30 overflow-hidden relative shrink-0">
								{activeProduct.image ? <Image src={activeProduct.image} alt={activeProduct.name} fill className="object-cover" /> : <div className="w-full h-full grid place-items-center"><Package size={14} className="text-N300" /></div>}
							</div>
							<span className="text-sm font-medium text-N800">{activeProduct.name}</span>
						</div>
					)}

					<div>
						<label className="text-xs text-N500 mb-2 block">Rating</label>
						<StarPick value={rating} onSelect={setRating} size={24} />
					</div>

					{/* Photo upload */}
					<div>
						<label className="text-xs text-N500 mb-2 block">Photos <span className="text-R400">*</span> <span className="text-N400">(at least 1, up to 5)</span></label>
						<div className="flex gap-2 flex-wrap">
							{images.map((img, i) => (
								<div key={i} className="relative w-16 h-16 rounded border border-N30 overflow-hidden shrink-0">
									<Image src={img} alt="" fill className="object-cover" />
									<button type="button" onClick={() => removeImage(i)}
										className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white/90 grid place-items-center shadow" aria-label="Remove">
										<X size={10} className="text-N700" />
									</button>
								</div>
							))}
							{images.length < 5 && (
								<button type="button" onClick={() => fileRef.current?.click()}
									className="w-16 h-16 rounded border-2 border-dashed border-N30 hover:border-BR300 grid place-items-center shrink-0 transition-colors">
									{uploading ? <Loader2 size={16} className="text-BR400 animate-spin" /> : <Camera size={16} className="text-N400" />}
								</button>
							)}
						</div>
						<input ref={fileRef} type="file" accept="image/*" className="hidden"
							onChange={(e) => { const file = e.target.files?.[0]; if (file) onPickImage(file); e.target.value = ""; }} />
					</div>

					<div>
						<label className="text-xs text-N500 mb-1 block">Title</label>
						<input placeholder="Give your review a title" value={title} onChange={(e) => setTitle(e.target.value)}
							className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
					</div>
					<div>
						<label className="text-xs text-N500 mb-1 block">Your Review</label>
						<textarea placeholder="Share your experience…" rows={4} value={comment} onChange={(e) => setComment(e.target.value)}
							className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none resize-y" />
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default ProductReviewsPage;
