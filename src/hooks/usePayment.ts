// hooks/useBuyCredits.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { transactionService } from "../services/payment";

import apiRequest from "../utils/apiRequest";
import type { AxiosError } from "axios";

export const usePayment = () => {
  // Poll backend for transaction status

  const MAX_ATTEMPTS = 10;
  const pollTransactionStatus = async (reference: string, attempts: number) => {
    if (attempts >= MAX_ATTEMPTS) {
      toast.info(
        "Confirmation timed out. Refresh and check your order status on your profile.",
      );

      return;
    }
    try {
      const res = await apiRequest.get(`/transaction/status/${reference}`);
      const status = res.data.status;

      if (status === "success") {
        return toast.success("Payment successful");
      } else if (status === "failed") {
        return toast.error("Payment failed");
      } else {
        setTimeout(() => pollTransactionStatus(reference, attempts + 1), 3000);
      }
    } catch (err) {
      console.error("Polling error:", err);
      toast.error("Could not verify payment status.");

      return;
    }
  };

  return useMutation({
    mutationFn: (orderId: string) =>
      transactionService.initiatePayment(orderId),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: (data: any) => {
      if (data.success) {
        const { reference, amount, email } = data;
        console.log("Payment initiation response:", data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const handler = (window as any).PaystackPop.setup({
          key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
          email,
          amount: amount * 100,
          ref: reference,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          callback: (response: any) => {
            if (response.status === "success") {
              toast.info("Waiting for server confirmation...");
              pollTransactionStatus(reference, 0); // start polling
            }
          },
          onClose: () => {
            toast.info("Payment modal closed");
          },
        });

        handler.openIframe();
      } else {
        toast.error(data.message || "Failed to initiate payment.");
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: unknown) => {
      const err = error as AxiosError<{ message: string }>;
      if (err.response) {
        toast.error(
          err.response.data.message || "Failed to initiate payment, try again!",
        );
      } else {
        toast.error("Unexpected error occurred. Please try again.");
      }
    },
  });
};
