import apiRequest from "../utils/apiRequest";

export const signInService = async (email: string, password: string) => {
  const response = await apiRequest.post("/user/login", { email, password });
  return response.data; // { message, token }
};

export const signUpService = async (
  name: string,
  email: string,
  password: string,
) => {
  const response = await apiRequest.post("/user/register", {
    name,
    email,
    password,
  });
  return response.data; // { message, token }
};
