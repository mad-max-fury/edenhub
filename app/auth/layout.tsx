import AuthLayout from "@/layouts/authLayout";

export default function layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
