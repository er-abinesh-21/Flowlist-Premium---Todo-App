import AuthPage from "@/views/AuthPage";

export const metadata = {
  title: "Sign Up | Flowlist",
};

export default function SignupRoute() {
  return <AuthPage mode="signup" />;
}
