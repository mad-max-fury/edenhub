import { type ReactNode } from "react";
import Link from "next/link";
import { AuthLogo } from "@/assets/svgs";
import { AuthRouteConfig } from "@/constants/routes";

interface LayoutProps {
  children: ReactNode;
}

const AuthWrapper: React.FC<LayoutProps> = ({ children }) => {
  return (
    <section className="flex flex-col items-center justify-center">
      <Link href={AuthRouteConfig.HOME}>
        <div className="mb-7 flex items-center gap-2">
          <AuthLogo />
        </div>
      </Link>
      <div className="h-auto w-[500px] rounded-lg bg-N0 p-[40px] shadow-auth mmd:w-[380px] mmd:p-[30px]">
        {children}
      </div>
    </section>
  );
};

export default AuthWrapper;
