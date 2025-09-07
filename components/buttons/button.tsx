import * as React from "react";
import { cn } from "@/utils/helpers";
import { cva, type VariantProps } from "class-variance-authority";

import { Spinner } from "../loaders";
import { Typography } from "../typography";

const buttonVariants = cva(" transition-all ease-in-out duration-400", {
	variants: {
		variant: {
			primary:
				"bg-B400 hover:bg-B300 text-N0 disabled:bg-B75 disabled:text-N70 disabled:cursor-not-allowed", // blue
			secondary:
				"bg-N20 text-N700 hover:bg-N40 disabled:opacity-50 hover:disabled:bg-N20 disabled:cursor-not-allowed", // extra light ash
			neutral:
				"bg-N0 hover:bg-N20 text-N700 disabled:bg-N20 disabled:text-N70 disabled:cursor-not-allowed", // white
			tertiary:
				"bg-Y300 hover:bg-Y200 text-N0 disabled:bg-Y75 disabled:text-N70 disabled:cursor-not-allowed", // yellow
			danger:
				"bg-R400 hover:bg-R300 text-N0 disabled:bg-R75 disabled:text-N20 disabled:cursor-not-allowed", // red
			brown:
				"bg-BR500 hover:bg-BR400 text-N0 disabled:bg-BR75 disabled:text-N20 disabled:cursor-not-allowed",
			gold:
				"bg-card hover:bg-LB400 text-N0 disabled:bg-LB75 disabled:text-N20 disabled:cursor-not-allowed", // brown
			"brown-light":
				"bg-BR400 hover:bg-BR300 text-N0 disabled:bg-BR75 disabled:text-N20 disabled:cursor-not-allowed", // brown light
			plain:
				"bg-transparent text-N0 hover:bg-N20 hover:text-BR500 disabled:bg-N20 disabled:text-N70 disabled:cursor-not-allowed border border-N0", // plain
		},
		size: {
			default: "p-[12px]",
			plain: "",
		},
		types: {
			outline: "",
			filled: "",
		},
		shape: {
			rounded: "rounded",
			pill: "rounded-[40px]",
			none: "",
		},
	},

	compoundVariants: [
		{
			types: "outline",
			variant: "primary",
			className:
				"bg-transparent text-B400 border border-B400 hover:border-transparent hover:text-N0",
		},
		{
			types: "outline",
			variant: "secondary",
			className: "bg-transparent text-N70 border border-N40 text-N600",
		},
		{
			types: "outline",
			variant: "tertiary",
			className:
				"bg-transparent text-Y300 border border-Y300 hover:border-transparent hover:text-N0",
		},
		{
			types: "outline",
			variant: "danger",
			className:
				"bg-transparent text-R400 border border-R400 hover:border-transparent hover:text-N0",
		},
		{
			types: "outline",
			variant: "brown",
			className:
				"bg-transparent text-BR400 border border-BR400 hover:border-transparent hover:text-N0",
		},
		{
			types: "outline",
			variant: "brown-light",
			className:
				"bg-transparent text-BR300 border border-BR300 hover:border-transparent hover:text-N0",
		},
		{
			types: "outline",
			variant: "gold",
			className:
				"bg-transparent text-LB400 border border-LB400 hover:border-transparent hover:text-N0",
		},
	],
	defaultVariants: {
		variant: "primary",
		size: "default",
		shape: "none",
		types: "filled",
	},
});

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "primary",
			types = "filled",
			shape = "rounded",
			size,
			children,
			loading = false,
			...props
		},
		ref
	) => {
		const Comp = "button";
		return (
			<Comp
				className={cn(
					buttonVariants({ variant, size, types, shape, className }),
					"flex items-center justify-center gap-4"
				)}
				ref={ref}
				{...props}
			>
				{!loading && (
					<Typography variant={"p-m"} className="!text-[inherit]">
						{" "}
						<span>{children}</span>
					</Typography>
				)}
				{loading && (
					<Spinner
						color={
							variant === "neutral" || variant === "secondary" ? "N700" : undefined
						}
					/>
				)}
			</Comp>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
