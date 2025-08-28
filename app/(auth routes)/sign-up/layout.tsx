import AuthLayout from "../layout";

export default function SignUpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sign-up-layout">
      <AuthLayout>{children}</AuthLayout>
    </div>
  );
}
