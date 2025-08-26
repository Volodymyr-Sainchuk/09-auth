import AuthLayout from "../layout";

export function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout layoutType="sign-up">{children}</AuthLayout>;
}
