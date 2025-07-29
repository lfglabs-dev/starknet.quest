import React, { FunctionComponent } from "react";
import TextInput from "../textInput";
import { UpdateQuest } from "../../../types/backTypes";
import Button from "@components/UI/button";
import { AdminService } from "@services/authService";
import { useNotification } from "@context/NotificationProvider";

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
  const { showNotification } = useNotification();

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
      <div className="flex flex-col gap-5">
        <TextInput
          name="banner.image"
          value={questInput.banner?.image || ""}
          onChange={handleQuestInputChange}
          label="Image URL"
          placeholder="Enter Image URL"
        />
        <input
          type="file"
          name="banner_image_file"
          accept=".webp"
          className="border border-[#f4faff4d] rounded-lg p-2 w-80"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            if (!file.type.includes('webp')) {
              showNotification("Only .webp files are allowed", "error");
              return;
            }
            const imageName = `${questInput.id}_banner`;
            const imageUrl = `${process.env.NEXT_PUBLIC_API_LINK}/images/${imageName}`;
            try {
              await AdminService.uploadImage(file, imageName);
              setQuestInput((prev) => ({
                ...prev,
                banner: {
                  tag: prev.banner?.tag || "",
                  title: prev.banner?.title || "",
                  description: prev.banner?.description || "",
                  cta: prev.banner?.cta || "",
                  href: prev.banner?.href || "",
                  image: imageUrl,
                },
              }));
              showNotification("Banner image uploaded successfully", "success");
            } catch (err) {
              showNotification(
                err instanceof Error ? err.message : "Failed to upload banner image",
                "error"
              );
            }
          }}
        />
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
