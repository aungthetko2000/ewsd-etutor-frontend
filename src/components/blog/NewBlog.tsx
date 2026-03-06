import React, { useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "../store/useStore";
import LoaderIcon from "../common/LoaderIcon";
import { toast } from "react-toastify";

interface NewBlogProps {
  show: boolean;
  onClose: () => void;
}

const NewBlog: React.FC<NewBlogProps> = observer(({ show, onClose }) => {
  const { blogStore } = useStore();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  if (!show) return null;

  const image = blogStore.state.image;
  const preview = image ? URL.createObjectURL(image) : null;

  const handleSubmit = async () => {
    await blogStore.createBlog();
    toast.success(blogStore.state.message, {
      hideProgressBar: true,
      style: {
        background: "linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%)",
        color: "#9a3412",
        fontWeight: "700",
        fontSize: "14px",
        borderRadius: "16px",
        border: "1px solid #ffedd5",
        boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.15)",
        padding: "16px"
      }
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    blogStore.state.setImage(file);
  };

  const removeImage = () => {
    blogStore.state.setImage(undefined);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    blogStore.state.setImage(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30 backdrop-blur-sm p-0 sm:p-4 lg:p-6">
      {blogStore.state.loading && <LoaderIcon />}
      <div
        className="
        w-full bg-white shadow-2xl border border-gray-100
        rounded-t-3xl sm:rounded-3xl
        sm:max-w-lg lg:max-w-2xl
        max-h-[92vh] sm:max-h-[88vh]  
        flex flex-col
        overflow-hidden
      "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 sm:px-6 sm:py-4 shrink-0 border-b border-gray-100">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">
              Create New Blog
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">
              Fill in the details below to publish
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 sm:px-6 py-4 space-y-4">
            {/* Image Upload */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-600">
                Cover Image
              </label>

              {preview ? (
                <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt="Cover"
                    className="w-full h-40 object-cover"
                  />

                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed h-40 cursor-pointer transition ${dragging
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 bg-gray-50"
                    }`}
                >
                  <p className="text-sm text-gray-500">
                    Drag & drop or click to upload
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-600">
                Blog Title
              </label>

              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Getting Started with React Hooks"
                value={blogStore.state.title}
                onChange={(e) =>
                  blogStore.state.setField("title", e.target.value)
                }
              />
            </div>

            {/* Content */}
            <div>
              <textarea
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                placeholder="Brief summary of your blog..."
                value={blogStore.state.content}
                onChange={(e) =>
                  blogStore.state.setField("content", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-gray-500"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="cursor-pointer bg-gradient-to-br from-orange-500 to-rose-500 px-6 rounded-xl bg-orange-500 py-2.5 text-sm font-bold text-white"
            >
              Create Blog
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default NewBlog;
