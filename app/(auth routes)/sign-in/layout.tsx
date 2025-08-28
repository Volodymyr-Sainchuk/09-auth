import AuthLayout from "../layout";

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sign-in-layout">
      <AuthLayout>{children}</AuthLayout>
    </div>
  );
}
