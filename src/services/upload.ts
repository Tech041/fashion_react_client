import apiRequest from "../utils/apiRequest";

export const uploadProductService = async (
  formData: FormData,
  onUploadProgress?: (progress: number) => void,
) => {
  const response = await apiRequest.post("/product/Upload", formData, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onUploadProgress: (event: any) => {
      if (event.total && onUploadProgress) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onUploadProgress(percent);
      }
    },
  });
  return response.data;
};
