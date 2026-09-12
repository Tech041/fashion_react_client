/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import imageCompression from "browser-image-compression";
import Container from "../components/Container";
import { useUploadProduct } from "../hooks/useUploadProduct";
import AdminNavbar from "../components/AdminNavbar";
import slugify from "slugify";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    Name: "",
    Description: "",
    Price: "",
    Sizes: [] as string[],
    Collection: "New Arrivals",
  });
  const [progress, setProgress] = useState<number>(0);

  const { mutate, isPending } = useUploadProduct(setProgress);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!file) return;

    try {
      const options = { maxSizeMB: 2, maxWidthOrHeight: 1200 };
      const compressedFile = await imageCompression(file, options);

      const productSlug = slugify(form.Name, { lower: true });

      const formData = new FormData();
      formData.append("ProductSlug", productSlug);
      formData.append("Image", compressedFile);
      Object.entries(form).forEach(([key, value]) => {
        formData.append(
          key,
          Array.isArray(value) ? JSON.stringify(value) : value,
        );
      });

      mutate(formData, {
        onSuccess: () => {
          setForm({
            Name: "",
            Description: "",
            Price: "",
            Sizes: [],
            Collection: "New Arrivals",
          });
          setFile(null);
          setProgress(0);
        },
        onError: () => {
          setProgress(0);
        },
      });
    } catch (err) {
      setProgress(0);
    }
  };

  return (
    <main className="min-h-screen mb-130 lg:mb-80 relative z-30 bg-white">
      <AdminNavbar />
      <Container>
        <h1 className="text-2xl font-bold mb-6 text-center mt-20">
          Upload Product
        </h1>
        <form className="space-y-8 max-w-3xl mx-auto">
          <input
            type="text"
            name="Name"
            placeholder="Product Name"
            value={form.Name}
            onChange={handleChange}
            className="w-full h-16 border border-gray-300 px-4 py-3 rounded-2xl shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all"
          />
          <textarea
            name="Description"
            placeholder="Description"
            value={form.Description}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-2xl shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all min-h-[120px]"
          />
          <input
            type="number"
            name="Price"
            placeholder="Price"
            value={form.Price}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-2xl shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all"
          />

          {/* File upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full border border-gray-300 px-4 py-3 rounded-2xl shadow-sm cursor-pointer focus:ring-2 focus:ring-black transition-all"
          />

          {/* Show preview */}
          {file && (
            <div className="mt-4">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="max-h-64 rounded-2xl border shadow-md"
              />
            </div>
          )}

          <select
            name="Collection"
            value={form.Collection}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-3 rounded-2xl shadow-sm focus:ring-2 focus:ring-black focus:border-black transition-all"
          >
            <option value="New Arrivals">New Arrivals</option>
            <option value="Best Sellers">Best Sellers</option>
          </select>

          <div className="flex flex-wrap gap-3">
            {["XS", "S", "M", "L", "XL", "XXL"].map((Size) => (
              <label
                key={Size}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-2xl shadow-sm cursor-pointer hover:bg-gray-50 transition"
              >
                <input
                  type="checkbox"
                  checked={form.Sizes.includes(Size)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      Sizes: e.target.checked
                        ? [...form.Sizes, Size]
                        : form.Sizes.filter((s) => s !== Size),
                    })
                  }
                />
                {Size}
              </label>
            ))}
          </div>

          {/* Progress bar */}
          {progress > 0 && (
            <div className="w-full bg-gray-200 rounded-2xl h-3 shadow-inner">
              <div
                className="bg-green-500 h-3 rounded-2xl transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-2xl shadow-md hover:bg-gray-800 transition disabled:opacity-50"
          >
            {isPending ? "Uploading..." : "Upload Product"}
          </button>
        </form>
      </Container>
    </main>
  );
}
