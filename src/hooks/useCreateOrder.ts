import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCheckoutStore } from "../store/checkoutStore";
import { createOrderService } from "../services/order";

interface OrderItemPayload {
  productId: string;
  size: string;
  quantity: number;
}

interface CreateOrderPayload {
  name: string;
  contact: string;
  address: string;
  state: string;
  items: OrderItemPayload[];
}

export const useCreateOrder = () => {
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrderService(payload),
    onSuccess: () => {
      toast.success("Order placed successfully");
      clearCheckout();
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.response?.data ||
        "Failed to place order. Please try again.";
      toast.error("Error placing order");
      console.error(`Error`, message);
    },
  });
};
