import AuthLayout from "../layout";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout layoutType="sign-up">{children}</AuthLayout>;
}
