interface LandingTabProps {
	name: string;
	isActiveTab: boolean;
	onClick: () => void;
}

export const LandingTab = ({ name, isActiveTab, onClick }: LandingTabProps) => {
	return (
		<button
			className={`py-2 lg:py-3 px-[clamp(26px,4vw,32px)] font-normal border rounded-[40px] cursor-pointer capitalize ${isActiveTab ? "bg-[#42312A] border-transparent text-white" : "bg-transparent border-[#42312A] text-[#42312A]"} flex-shrink-0`}
			onClick={onClick}
			type="button"
		>
			{name}
		</button>
	);
};
