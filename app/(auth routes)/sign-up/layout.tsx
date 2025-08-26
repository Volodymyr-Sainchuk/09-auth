import AuthLayout from "../layout";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout type="sign-up">{children}</AuthLayout>;
}
