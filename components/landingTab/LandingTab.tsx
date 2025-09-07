interface LandingTabProps {
	name: string;
	isActiveTab: boolean;
	onClick: () => void;
}

export const LandingTab = ({ name, isActiveTab, onClick }: LandingTabProps) => {
	return (
		<button
			className={`py-3 px-8 font-normal border rounded-[40px] cursor-pointer capitalize ${isActiveTab ? "bg-[#42312A] border-transparent text-white" : "bg-transparent border-[#42312A] text-[#42312A]"} flex-shrink-0`}
			onClick={onClick}
			type="button"
		>
			{name}
		</button>
	);
};
