import AuthLayout from "../layout";

export function SignInLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout layoutType="sign-in">{children}</AuthLayout>;
}
