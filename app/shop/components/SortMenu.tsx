"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export interface SortOption {
	label: string;
	value: string;
}

interface SortMenuProps {
	options: SortOption[];
	value: string;
	onChange: (value: string) => void;
}

export const SortMenu = ({ options, value, onChange }: SortMenuProps) => {
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const onDoc = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener("mousedown", onDoc);
		return () => document.removeEventListener("mousedown", onDoc);
	}, []);

	const current = options.find((o) => o.value === value);

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				onClick={() => setOpen((o) => !o)}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="flex items-center justify-between gap-2 min-w-[140px] border border-N30 rounded px-3 py-2 text-sm text-N700 bg-white hover:border-N200 transition-colors"
			>
				<span className="truncate">
					<span className="text-N400">Sort: </span>
					{current?.label ?? "Featured"}
				</span>
				<ChevronDown size={14} className={`shrink-0 text-N400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
			</button>

			{open && (
				<div role="listbox" className="absolute right-0 mt-1 w-52 bg-white border border-N30 rounded shadow-lg overflow-hidden z-50 py-1">
					{options.map((o) => {
						const active = o.value === value;
						return (
							<button
								key={o.value}
								type="button"
								role="option"
								aria-selected={active}
								onClick={() => { onChange(o.value); setOpen(false); }}
								className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors hover:bg-N10 ${active ? "text-N900 font-medium" : "text-N600"}`}
							>
								{o.label}
								{active && <Check size={14} className="text-N800" />}
							</button>
						);
					})}
				</div>
			)}
		</div>
	);
};
