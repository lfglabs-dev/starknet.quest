import React, { FunctionComponent } from "react";
import TextInput from "../textInput";
import { UpdateQuest } from "../../../types/backTypes";
import Button from "@components/UI/button";

type BannerDetailsFormProps = {
  questInput: UpdateQuest;
  setQuestInput: React.Dispatch<React.SetStateAction<UpdateQuest>>;
  handleQuestInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  submitButtonDisabled: boolean;
};

const BannerDetailsForm: FunctionComponent<BannerDetailsFormProps> = ({
  questInput,
  handleQuestInputChange,
  onSubmit,
  submitButtonDisabled,
}) => {
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
      <div className="w-full sm:w-fit">
        <Button onClick={onSubmit} disabled={submitButtonDisabled}>
          <p>Save Changes</p>
        </Button>
      </div>
    </div>
  );
};

export default BannerDetailsForm;
