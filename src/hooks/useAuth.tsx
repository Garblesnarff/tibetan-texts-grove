import { useAuthContext } from "@/components/providers/AuthProvider";

export const useAuth = () => {
  const { isAdmin } = useAuthContext();
  return { isAdmin };
};