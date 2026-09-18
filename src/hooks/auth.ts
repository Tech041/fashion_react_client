import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { toast } from "sonner";
import { signInService, signUpService } from "../services/auth";

export const useSignIn = () => {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signInService(email, password),
    onSuccess: (data) => {
      setToken(data.token); // store JWT in Zustand
      toast.success(data.message);
      window.location.href = "/shop"; // redirect after login
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Login failed");
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => signUpService(name, email, password),
    onSuccess: (data) => {
      toast.success(data.message);
      window.location.href = "/sign-in"; // redirect after register
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Registeration failed");
    },
  });
};
