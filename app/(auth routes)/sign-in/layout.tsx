import AuthLayout from "../layout";

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout layoutType="sign-in">{children}</AuthLayout>;
}
