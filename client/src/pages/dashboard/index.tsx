// import { useAuth } from "@/hooks/useAuth";
import PetOwnerDashboard from "./pet-owner";
import TrainerDashboard from "./trainer";
import InstituteAdminDashboard from "./institute-admin";
import AdminDashboard from "./admin";

export default function Dashboard() {
  // Mock user data for development
  const user = {
    id: 1,
    name: "관리자",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  };
  
  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading dashboard...</div>;
  }

  // Render the appropriate dashboard based on user role
  switch (user.role) {
    case "pet-owner":
      return <PetOwnerDashboard />;
    case "trainer":
      return <TrainerDashboard />;
    case "institute-admin":
      return <InstituteAdminDashboard />;
    case "admin":
      return <AdminDashboard />;
    default:
      return <PetOwnerDashboard />; // Default to pet owner dashboard for general users
  }
}
