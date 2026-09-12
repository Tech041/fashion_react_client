import apiRequest from "../utils/apiRequest";

export const signInService = async (email: string, password: string) => {
  const response = await apiRequest.post("/user/login", { email, password });
  return response.data; // { message, token }
};
