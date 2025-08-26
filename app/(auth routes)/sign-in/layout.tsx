import AuthLayout from "../layout";

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout type="sign-in">{children}</AuthLayout>;
}
