import React, { FunctionComponent, useRef, useState } from "react";
import TextInput from "../textInput";
import { UpdateQuest } from "../../../types/backTypes";
import Button from "@components/UI/button";
import axios from "axios"; 

type BannerDetailsFormProps = {
  questInput: UpdateQuest;
  setQuestInput: React.Dispatch<React.SetStateAction<UpdateQuest>>;
  handleQuestInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  submitButtonDisabled: boolean;
};

const BannerDetailsForm: FunctionComponent<BannerDetailsFormProps> = ({
  questInput,
  setQuestInput,
  handleQuestInputChange,
  onSubmit,
  submitButtonDisabled,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type and extension
    if (file.type !== "image/webp" || !file.name.toLowerCase().endsWith('.webp')) {
      console.error("Please upload a .webp image.");
      return;
    }

    // Enforce file size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File size must be less than 5MB.");
      return;
    }

    if (!questInput.id) {
      console.error("Quest ID is required to name the file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file, `${questInput.id}_banner.webp`);

    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_LINK + "/admin/upload_image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const imageUrl = res.data.url;
      setQuestInput((prev) => ({
        ...prev,
        banner: {
          tag: prev.banner?.tag ?? "",
          title: prev.banner?.title ?? "",
          description: prev.banner?.description ?? "",
          cta: prev.banner?.cta ?? "",
          href: prev.banner?.href ?? "",
          image: imageUrl,
        },
      }));
    } catch (err: unknown) {
      console.error("Image upload failed:", err instanceof Error ? err.message : "Unknown error");
    }
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        name="banner.tag"
        value={questInput.banner?.tag || ""}
        onChange={handleQuestInputChange}
        label="Tag"
        placeholder="Enter banner tag"
      />
      <TextInput
        name="banner.title"
        value={questInput.banner?.title || ""}
        onChange={handleQuestInputChange}
        label="Title"
        placeholder="Enter banner title"
      />
      <TextInput
        name="banner.description"
        value={questInput.banner?.description || ""}
        onChange={handleQuestInputChange}
        label="Description"
        placeholder="Enter banner description"
      />
      <TextInput
        name="banner.cta"
        value={questInput.banner?.cta || ""}
        onChange={handleQuestInputChange}
        label="CTA"
        placeholder="Enter Call-to-Action"
      />
      <TextInput
        name="banner.href"
        value={questInput.banner?.href || ""}
        onChange={handleQuestInputChange}
        label="Link"
        placeholder="Enter Link"
      />
      <TextInput
        name="banner.image"
        value={questInput.banner?.image || ""}
        onChange={handleQuestInputChange}
        label="Image URL"
        placeholder="Enter Image URL"
      />
      {/* Banner image upload */}
      <div>
        <label className="block mb-1 font-medium">Upload Banner (.webp)</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".webp"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <span className="text-sm text-gray-500 ml-2">Uploading...</span>
        )}
        {questInput.banner?.image && (
          <div className="mt-2">
            <img
              src={questInput.banner.image}
              alt="Banner Preview"
              style={{ maxWidth: 300, borderRadius: 8 }}
            />
          </div>
        )}
      </div>
      <div className="w-full sm:w-fit">
        <Button onClick={onSubmit} disabled={submitButtonDisabled}>
          <p>Save Changes</p>
        </Button>
      </div>
    </div>
  );
};

export default BannerDetailsForm;
