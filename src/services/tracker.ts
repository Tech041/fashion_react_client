import apiRequest from "../utils/apiRequest";

export async function trackVisitor(visitorId: string) {
  return apiRequest.post(`visit/track/${visitorId}`);
}

export async function getVisitorStats(page: number = 1, limit: number = 10) {
  const res = await apiRequest.get(`visit/stats`, {
    params: { page, limit },
  });
  return res.data;
}
