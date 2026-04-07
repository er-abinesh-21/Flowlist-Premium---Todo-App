import AuthPage from "@/views/AuthPage";

export const metadata = {
  title: "Log In | Flowlist",
};

export default function LoginRoute() {
  return <AuthPage mode="login" />;
}
