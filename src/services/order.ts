import apiRequest from "../utils/apiRequest";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createOrderService = async (order: any) => {
  const res = await apiRequest.post(`/orders`, order);
  return res.data;
};
