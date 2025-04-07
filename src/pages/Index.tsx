
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useStore();
  
  useEffect(() => {
    // Check if user is logged in
    if (user) {
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  // Show a loading state while redirecting
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-medium text-gray-700">Loading...</h2>
    </div>
  );
};

export default Index;
