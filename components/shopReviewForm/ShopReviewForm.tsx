"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, ImagePlus, Loader2, Star, X } from "lucide-react";
import {
	useCreateShopReviewMutation,
	useUploadReviewImageMutation,
} from "@/redux/api/shopReviews";
import { getApiErrorMessage } from "@/utils/helpers";
import { Button } from "../buttons";
import { Modal } from "../modal/modal";
import { notify } from "../notifications/notify";

interface FormData {
	name: string;
	title?: string;
	comment: string;
}

export const ShopReviewForm = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
	const [rating, setRating] = useState(5);
	const [image, setImage] = useState("");
	const fileRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>();
	const [createReview, { isLoading }] = useCreateShopReviewMutation();
	const [uploadImage, { isLoading: uploading }] = useUploadReviewImageMutation();

	const resetForm = () => { reset(); setRating(5); setImage(""); };

	const onPickImage = async (file: File) => {
		const fd = new FormData();
		fd.append("file", file);
		try {
			const res = await uploadImage(fd).unwrap();
			setImage(res.data.url);
		} catch (err) {
			notify.error({ message: "Could not upload picture", subtitle: getApiErrorMessage(err) });
		}
	};

	const onSubmit = async (data: FormData) => {
		try {
			await createReview({ ...data, rating, image: image || undefined }).unwrap();
			notify.success({ message: "Thank you!", subtitle: "Your review will appear once approved." });
			resetForm();
			onClose();
		} catch (err) {
			notify.error({ message: "Could not submit review", subtitle: getApiErrorMessage(err) });
		}
	};

	return (
		<Modal
			isOpen={open}
			closeModal={onClose}
			title="Share your experience"
			mobileLayoutType="normal"
			footerData={
				<div className="flex gap-3 justify-end">
					<Button variant="gold" onClick={onClose}>Cancel</Button>
					<Button variant="brown-light" loading={isLoading} onClick={handleSubmit(onSubmit)}>Submit review</Button>
				</div>
			}
		>
			<form className="p-6 flex flex-col gap-4">
				{/* Stars */}
				<div>
					<label className="text-xs text-N500 mb-2 block">Rating</label>
					<div className="flex items-center gap-1">
						{Array.from({ length: 5 }).map((_, i) => (
							<button type="button" key={i} onClick={() => setRating(i + 1)} aria-label={`${i + 1} star`}>
								<Star size={24} className={i < rating ? "fill-amber-400 text-amber-400" : "text-N100"} />
							</button>
						))}
					</div>
				</div>

				{/* Photo */}
				<div className="flex items-center gap-3">
					{image ? (
						<div className="relative w-14 h-14 rounded-full overflow-hidden border border-N30 shrink-0">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img src={image} alt="You" className="w-full h-full object-cover" />
							<button type="button" onClick={() => setImage("")}
								className="absolute top-0 right-0 w-5 h-5 rounded-full bg-white/90 grid place-items-center shadow" aria-label="Remove">
								<X size={10} className="text-N700" />
							</button>
						</div>
					) : (
						<button type="button" onClick={() => fileRef.current?.click()}
							className="w-14 h-14 rounded-full border-2 border-dashed border-N30 hover:border-BR300 grid place-items-center shrink-0 transition-colors">
							{uploading ? <Loader2 size={16} className="text-BR400 animate-spin" /> : <ImagePlus size={16} className="text-N400" />}
						</button>
					)}
					<div>
						<div className="flex items-center gap-1.5 text-sm text-N600"><Camera size={13} /> Add your photo</div>
						<p className="text-xs text-N400">Optional · JPG or PNG</p>
					</div>
					<input ref={fileRef} type="file" accept="image/*" className="hidden"
						onChange={(e) => { const file = e.target.files?.[0]; if (file) onPickImage(file); e.target.value = ""; }} />
				</div>

				{/* Fields */}
				<div>
					<label className="text-xs text-N500 mb-1 block">Your name</label>
					<input {...register("name", { required: true })} placeholder="Your name"
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
					{errors.name && <span className="text-xs text-R400 mt-0.5 block">Name is required</span>}
				</div>

				<div>
					<label className="text-xs text-N500 mb-1 block">Title (optional)</label>
					<input {...register("title")} placeholder="Title"
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none" />
				</div>

				<div>
					<label className="text-xs text-N500 mb-1 block">Your review</label>
					<textarea {...register("comment", { required: true, minLength: 3 })} placeholder="Tell us about your experience…" rows={4}
						className="w-full border border-N40 rounded px-3 py-2.5 text-sm focus:border-BR400 outline-none resize-y" />
					{errors.comment && <span className="text-xs text-R400 mt-0.5 block">Please write a few words</span>}
				</div>
			</form>
		</Modal>
	);
};
