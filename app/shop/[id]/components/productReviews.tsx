"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { Camera, ChevronLeft, ChevronRight, Loader2, MessageCircle, MessageSquare, Star, ThumbsUp, X } from "lucide-react";
import { Button, notify } from "@/components";
import { Modal } from "@/components/modal/modal";
import { useAuthModal } from "@/components/authModal/AuthModal";
import { cookieValues } from "@/constants/data";
import { getApiErrorMessage } from "@/utils/helpers";
import { useGetMeQuery } from "@/redux/api/auth";
import {
	useCreateReviewMutation,
	useGetProductReviewsQuery,
	useToggleReviewLikeMutation,
	useReplyToReviewMutation,
	type IReview,
	type IReviewReply,
} from "@/redux/api/reviews";
import { useUploadReviewImageMutation } from "@/redux/api/shopReviews";

const StarRow = ({ value, onSelect, size = 14 }: { value: number; onSelect?: (v: number) => void; size?: number }) => (
	<div className="flex items-center gap-0.5">
		{Array.from({ length: 5 }).map((_, i) => (
			<button key={i} type={onSelect ? "button" : undefined} disabled={!onSelect} onClick={() => onSelect?.(i + 1)}
				className={onSelect ? "cursor-pointer" : "cursor-default"}>
				<Star size={size} className={i < Math.round(value) ? "fill-amber-400 text-amber-400" : "text-N100"} />
			</button>
		))}
	</div>
);

const authorName = (r: IReview | IReviewReply) =>
	typeof r.user === "string" ? "Customer" : `${r.user.firstName} ${r.user.lastName}`.trim();

const authorInitials = (r: IReview | IReviewReply) => {
	if (typeof r.user === "string") return "C";
	return `${r.user.firstName?.[0] ?? ""}${r.user.lastName?.[0] ?? ""}`.toUpperCase();
};

const formatDate = (iso: string) =>
	new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const RatingBar = ({ star, count, total }: { star: number; count: number; total: number }) => {
	const pct = total > 0 ? (count / total) * 100 : 0;
	return (
		<div className="flex items-center gap-2 text-xs">
			<span className="w-3 text-right text-N500">{star}</span>
			<Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
			<div className="flex-1 h-1.5 bg-N20 rounded-full overflow-hidden">
				<div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
			</div>
			<span className="w-5 text-right text-N400">{count}</span>
		</div>
	);
};

const ImageLightbox = ({ images, initial, onClose }: { images: string[]; initial: number; onClose: () => void }) => {
	const [idx, setIdx] = useState(initial);
	return (
		<div className="fixed inset-0 z-[100000] bg-black/80 flex items-center justify-center" onClick={onClose}>
			<button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10"><X size={24} /></button>
			<div className="relative max-w-[90vw] max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
				<Image src={images[idx]} alt="" width={800} height={800} className="max-w-full max-h-[85vh] object-contain rounded" />
				{images.length > 1 && (
					<>
						<button onClick={() => setIdx((i) => (i > 0 ? i - 1 : images.length - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60"><ChevronLeft size={18} /></button>
						<button onClick={() => setIdx((i) => (i < images.length - 1 ? i + 1 : 0))} className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 text-white grid place-items-center hover:bg-black/60"><ChevronRight size={18} /></button>
					</>
				)}
				<div className="text-center text-white/60 text-xs mt-2">{idx + 1} / {images.length}</div>
			</div>
		</div>
	);
};

const ReplyForm = ({ reviewId, onDone }: { reviewId: string; onDone: () => void }) => {
	const [replyToReview, { isLoading }] = useReplyToReviewMutation();
	const [text, setText] = useState("");
	const submit = async () => {
		if (!text.trim()) return;
		try {
			await replyToReview({ id: reviewId, comment: text.trim() }).unwrap();
			setText("");
			onDone();
		} catch (err) { notify.error({ message: "Could not reply", subtitle: getApiErrorMessage(err) }); }
	};
	return (
		<div className="flex gap-2 mt-3">
			<input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a reply…"
				onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
				className="flex-1 border border-N30 rounded px-3 py-2 text-sm focus:border-BR400 outline-none" />
			<button onClick={submit} disabled={!text.trim() || isLoading}
				className="px-3 py-2 text-sm font-medium text-BR500 border border-BR400 rounded hover:bg-BR50 transition-colors disabled:opacity-50">
				{isLoading ? "…" : "Reply"}
			</button>
		</div>
	);
};

export const ProductReviews = ({ productId }: { productId: string }) => {
	const { requireAuth } = useAuthModal();
	const isLoggedIn = !!getCookie(cookieValues.token);
	const { data: meData } = useGetMeQuery(undefined, { skip: !isLoggedIn });
	const userId = meData?.data?._id;
	const { data } = useGetProductReviewsQuery({ productId, pageSize: 20 });
	const [createReview, { isLoading }] = useCreateReviewMutation();
	const [toggleLike] = useToggleReviewLikeMutation();
	const [uploadImage, { isLoading: uploading }] = useUploadReviewImageMutation();

	const [showForm, setShowForm] = useState(false);
	const [rating, setRating] = useState(0);
	const [title, setTitle] = useState("");
	const [comment, setComment] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);
	const [replyingTo, setReplyingTo] = useState<string | null>(null);
	const fileRef = useRef<HTMLInputElement>(null);

	const reviews = data?.data.data ?? [];
	const canReview = data?.data.canReview ?? false;
	const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

	const distribution = [5, 4, 3, 2, 1].map((star) => ({
		star, count: reviews.filter((r) => Math.round(r.rating) === star).length,
	}));

	const onPickImage = async (file: File) => {
		if (images.length >= 5) { notify.error({ message: "Maximum 5 images" }); return; }
		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await uploadImage(fd).unwrap();
			setImages((prev) => [...prev, res.data.url]);
		} catch (err) { notify.error({ message: "Upload failed", subtitle: getApiErrorMessage(err) }); }
	};
	const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

	const submit = async () => {
		if (!rating) { notify.error({ message: "Please select a rating" }); return; }
		if (!title.trim()) { notify.error({ message: "Please add a title" }); return; }
		if (!comment.trim()) { notify.error({ message: "Please write your review" }); return; }
		if (images.length === 0) { notify.error({ message: "Please add at least one photo" }); return; }
		try {
			await createReview({ product: productId, rating, title, comment, images }).unwrap();
			notify.success({ message: "Thanks for your review!" });
			setRating(0); setTitle(""); setComment(""); setImages([]);
			setShowForm(false);
		} catch (err) { notify.error({ message: "Could not submit", subtitle: getApiErrorMessage(err) }); }
	};

	const openForm = () => {
		if (!isLoggedIn) { requireAuth(() => setShowForm(true)); return; }
		setShowForm(true);
	};

	const handleLike = (reviewId: string) => {
		if (!isLoggedIn) { requireAuth(() => toggleLike(reviewId)); return; }
		toggleLike(reviewId);
	};

	const handleReply = (reviewId: string) => {
		if (!isLoggedIn) { requireAuth(() => setReplyingTo(reviewId)); return; }
		setReplyingTo(replyingTo === reviewId ? null : reviewId);
	};

	return (
		<section className="mt-16 border-t border-N20 pt-10">
			<div className="flex items-start justify-between gap-4 mb-8">
				<h2 className="text-[15px] font-semibold text-N900">Customer Reviews ({reviews.length})</h2>
				{canReview && <button onClick={openForm} className="text-sm text-BR500 hover:text-BR400 font-medium shrink-0">Write a review</button>}
			</div>

			{reviews.length === 0 ? (
				<div className="text-center py-12">
					<MessageSquare size={32} className="text-N200 mx-auto mb-3" />
					<p className="text-sm text-N500 mb-1">No reviews yet</p>
					<p className="text-xs text-N400 mb-4">Be the first to share your experience with this product.</p>
					{canReview && <button onClick={openForm} className="text-sm text-BR500 hover:underline font-medium">Write a review</button>}
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
					{/* Summary */}
					<div className="lg:sticky lg:top-6 h-fit">
						<div className="border border-N30 rounded p-5">
							<div className="flex items-center gap-3 mb-4">
								<span className="text-3xl font-bold text-N900">{avg.toFixed(1)}</span>
								<div>
									<StarRow value={avg} size={16} />
									<p className="text-xs text-N400 mt-0.5">Based on {reviews.length} review{reviews.length === 1 ? "" : "s"}</p>
								</div>
							</div>
							<div className="flex flex-col gap-1.5">
								{distribution.map((d) => <RatingBar key={d.star} star={d.star} count={d.count} total={reviews.length} />)}
							</div>
							{canReview && <button onClick={openForm} className="w-full mt-5 py-2.5 text-sm font-medium text-BR500 border border-BR400 rounded hover:bg-BR50 transition-colors">Write a review</button>}
						</div>
					</div>

					{/* List */}
					<div className="flex flex-col">
						{reviews.map((r, i) => {
							const liked = userId ? r.likedBy?.includes(userId) : false;
							return (
								<div key={r._id} className={`py-5 ${i > 0 ? "border-t border-N20" : ""}`}>
									<div className="flex items-start gap-3">
										<div className="w-9 h-9 rounded-full bg-N10 border border-N30 grid place-items-center text-xs font-semibold text-N500 shrink-0">
											{authorInitials(r)}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between gap-2">
												<div className="flex items-center gap-2">
													<span className="text-sm font-medium text-N800">{authorName(r)}</span>
													{r.verified && <span className="text-[10px] bg-G50 text-G600 px-1.5 py-0.5 rounded font-medium">Verified</span>}
												</div>
												<span className="text-xs text-N400 shrink-0">{formatDate(r.createdAt)}</span>
											</div>
											<div className="mt-1"><StarRow value={r.rating} size={12} /></div>
											<p className="text-sm font-medium text-N800 mt-2">{r.title}</p>
											<p className="text-sm text-N500 mt-0.5 leading-relaxed">{r.comment}</p>

											{/* Images */}
											{r.images && r.images.length > 0 && (
												<div className="flex gap-2 mt-3">
													{r.images.map((img, idx) => (
														<button key={idx} onClick={() => setLightbox({ images: r.images, index: idx })}
															className="w-16 h-16 rounded border border-N30 overflow-hidden relative shrink-0 hover:opacity-80 transition-opacity">
															<Image src={img} alt="" fill className="object-cover" />
														</button>
													))}
												</div>
											)}

											{/* Actions: Like + Reply */}
											<div className="flex items-center gap-4 mt-3">
												<button onClick={() => handleLike(r._id)}
													className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? "text-BR500" : "text-N400 hover:text-N700"}`}>
													<ThumbsUp size={13} className={liked ? "fill-BR500" : ""} />
													{r.likes > 0 ? `Helpful (${r.likes})` : "Helpful"}
												</button>
												{canReview && (
													<button onClick={() => handleReply(r._id)}
														className="flex items-center gap-1.5 text-xs font-medium text-N400 hover:text-N700 transition-colors">
														<MessageCircle size={13} />
														Reply{r.replies?.length > 0 ? ` (${r.replies.length})` : ""}
													</button>
												)}
											</div>

											{/* Replies */}
											{r.replies && r.replies.length > 0 && (
												<div className="mt-3 ml-1 pl-4 border-l-2 border-N20 flex flex-col gap-3">
													{r.replies.map((reply, ri) => (
														<div key={ri} className="flex items-start gap-2.5">
															<div className={`w-7 h-7 rounded-full grid place-items-center text-[10px] font-semibold shrink-0 ${
																reply.isAdmin ? "bg-BR500 text-white" : "bg-N10 border border-N30 text-N500"
															}`}>
																{reply.isAdmin ? "A" : authorInitials(reply as unknown as IReview)}
															</div>
															<div className="flex-1 min-w-0">
																<div className="flex items-center gap-2">
																	<span className="text-xs font-medium text-N700">
																		{reply.isAdmin ? "Store Admin" : authorName(reply as unknown as IReview)}
																	</span>
																	{reply.isAdmin && <span className="text-[9px] bg-BR50 text-BR500 px-1.5 py-0.5 rounded font-medium">Admin</span>}
																	<span className="text-[10px] text-N400">{formatDate(reply.createdAt)}</span>
																</div>
																<p className="text-sm text-N500 mt-0.5">{reply.comment}</p>
															</div>
														</div>
													))}
												</div>
											)}

											{/* Reply form */}
											{replyingTo === r._id && (
												<ReplyForm reviewId={r._id} onDone={() => setReplyingTo(null)} />
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{lightbox && <ImageLightbox images={lightbox.images} initial={lightbox.index} onClose={() => setLightbox(null)} />}

			{/* Write Review Modal */}
			<Modal isOpen={showForm} closeModal={() => setShowForm(false)} title="Write a Review" mobileLayoutType="normal"
				footerData={<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={() => setShowForm(false)}>Cancel</Button>
					<Button variant="brown-light" loading={isLoading} onClick={submit}>Submit</Button>
				</div>}>
				<div className="p-6 flex flex-col gap-5">
					<div>
						<label className="text-xs text-N500 mb-2 block">Rating</label>
						<StarRow value={rating} onSelect={setRating} size={28} />
					</div>
					<div>
						<label className="text-xs text-N500 mb-2 block">Photos <span className="text-R400">*</span> <span className="text-N400">(at least 1, up to 5)</span></label>
						<div className="flex gap-2 flex-wrap">
							{images.map((img, idx) => (
								<div key={idx} className="relative w-16 h-16 rounded border border-N30 overflow-hidden shrink-0">
									<Image src={img} alt="" fill className="object-cover" />
									<button type="button" onClick={() => removeImage(idx)} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white/90 grid place-items-center shadow"><X size={10} className="text-N700" /></button>
								</div>
							))}
							{images.length < 5 && (
								<button type="button" onClick={() => fileRef.current?.click()} className="w-16 h-16 rounded border-2 border-dashed border-N30 hover:border-BR300 grid place-items-center shrink-0 transition-colors">
									{uploading ? <Loader2 size={16} className="text-BR400 animate-spin" /> : <Camera size={16} className="text-N400" />}
								</button>
							)}
						</div>
						<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onPickImage(f); e.target.value = ""; }} />
					</div>
					<div>
						<label className="text-xs text-N500 mb-1 block">Title</label>
						<input placeholder="Summarize your experience" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
					</div>
					<div>
						<label className="text-xs text-N500 mb-1 block">Your Review</label>
						<textarea placeholder="What did you like or dislike?" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none resize-y" />
					</div>
					</div>
			</Modal>
		</section>
	);
};
