import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardPage from "@/views/DashboardPage";

export const metadata = {
  title: "Dashboard | Flowlist",
};

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  );
}
