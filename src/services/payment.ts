import apiRequest from "../utils/apiRequest";

export const transactionService = {
  async initiatePayment(orderId: string) {
    const res = await apiRequest.post(`/transaction/initiate/${orderId}`);
    return res.data; // { success, reference, amount, credits }
  },
};
