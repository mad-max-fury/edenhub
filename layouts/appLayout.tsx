import {
	createContext,
	Dispatch,
	SetStateAction,
	useEffect,
	useState,
	type ReactNode,
} from "react";
import { GlobalMenu, PageLoader, Tab } from "@/components";
import { IUserResponse, useGetStaffProfileQuery } from "@/redux/api";

interface LayoutProps {
	children: ReactNode;
	pageTabs?: Tab[];
	moduleTitle?: string;
}
interface UserContextType {
	user: IUserResponse | undefined;
	setUser: Dispatch<SetStateAction<IUserResponse | undefined>>;
}

export const UserContext = createContext<UserContextType | undefined>(
	undefined
);

const AppLayout: React.FC<LayoutProps> = () => {
	// const pathName = usePathname();
	// const activePage = pathName;
	const { data, isLoading, error } = useGetStaffProfileQuery();
	const [user, setUser] = useState<IUserResponse | undefined>(undefined);
	useEffect(() => {
		if (!isLoading && !error) {
			setUser(data?.data);
		}
	}, [setUser, isLoading, error, data]);

	if (isLoading) return <PageLoader isOuterPage />;
	if (error) return <p>An error occured</p>;
	return (
		<UserContext.Provider value={{ user, setUser }}>
			<main>
				<GlobalMenu />
			</main>
		</UserContext.Provider>
	);
};

export default AppLayout;
