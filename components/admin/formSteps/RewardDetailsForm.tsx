import React, { FunctionComponent, useCallback } from "react";
import TextInput from "../textInput";
import { SelectChangeEvent, Switch } from "@mui/material";
import { NFTUri, UpdateBoost, UpdateQuest } from "../../../types/backTypes";
import Button from "@components/UI/button";
import { boostDefaultInput } from "@constants/admin";
import { getTokenName } from "@utils/tokenService";
import { TOKEN_ADDRESS_MAP, TOKEN_DECIMAL_MAP } from "@constants/common";
import { getCurrentNetwork } from "@utils/network";
import Dropdown from "@components/UI/dropdown";
import { AdminService } from "@services/authService";
import { useNotification } from "@context/NotificationProvider";

type RewardDetailsFormProps = {
  handleQuestInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBoostInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleQuestImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  questInput: UpdateQuest;
  boostInput: typeof boostDefaultInput | UpdateBoost;
  nfturi: NFTUri;
  setNftUri: React.Dispatch<React.SetStateAction<NFTUri>>;
  setQuestInput: React.Dispatch<React.SetStateAction<UpdateQuest>>;
  setBoostInput:
    | React.Dispatch<React.SetStateAction<typeof boostDefaultInput>>
    | React.Dispatch<React.SetStateAction<UpdateBoost>>;
  setShowBoost: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
  submitButtonDisabled: boolean;
  buttonLoading: boolean;
  showBoost: boolean;
};

const RewardDetailsForm: FunctionComponent<RewardDetailsFormProps> = ({
  questInput,
  handleQuestInputChange,
  handleQuestImageChange,
  handleBoostInputChange,
  onSubmit,
  submitButtonDisabled,
  nfturi,
  setNftUri,
  showBoost,
  setShowBoost,
  boostInput,
  setBoostInput,
  buttonLoading,
  setQuestInput,
}) => {
  const network = getCurrentNetwork();
  const { showNotification } = useNotification();

  const handleBoostTokenChange = useCallback(
    (event: SelectChangeEvent) => {
      const tokenAddress = event.target.value;
      const tokenName =
        Object.keys(TOKEN_ADDRESS_MAP[network]).find(
          (key) => TOKEN_ADDRESS_MAP[network][key] === tokenAddress
        ) || "";
      setBoostInput((prev: any) => ({
        ...prev,
        token: tokenAddress,
        token_decimals:
          TOKEN_DECIMAL_MAP[tokenName as keyof typeof TOKEN_DECIMAL_MAP],
      }));
    },
    [setBoostInput, network]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-8">
        <TextInput
          onChange={(e) => {
            setNftUri((prev) => ({
              ...prev,
              name: e.target.value,
            }));
          }}
          value={nfturi?.name}
          name="rewards_nfts"
          label="NFT Name"
          placeholder="NFT Name"
        />
        <TextInput
          onChange={handleQuestInputChange}
          value={questInput.rewards_title ?? ""}
          name="rewards_title"
          label="Rewards Title"
          placeholder="NFT Name"
        />
        <div className="flex flex-col gap-5">
          <TextInput
            onChange={handleQuestImageChange}
            value={nfturi?.image}
            name="nft_image"
            label="NFT Image Path"
            placeholder="NFT Image Path"
          />
          <input
            type="file"
            name="nft_image_file"
            className="border border-[#f4faff4d] rounded-lg p-2 w-80"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              const imageName = `${questInput.id}_nft`;
              const imageUrl = `${process.env.NEXT_PUBLIC_API_LINK}/images/${imageName}`;
              try {
                await AdminService.uploadImage(file, imageName);
                setNftUri((prev) => ({
                  ...prev,
                  image: imageUrl,
                }));
                setQuestInput((prev) => ({
                  ...prev,
                  rewards_img: imageUrl,
                  img_card: imageUrl,
                }));
                showNotification("Image uploaded successfully", "success");
              } catch (err) {
                showNotification(
                  err instanceof Error ? err.message : "Failed to upload image",
                  "error"
                );
              }
            }}
          />
        </div>

        <TextInput
          onChange={(e) => {
            setNftUri((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          value={nfturi?.description ?? ""}
          name="description"
          label="NFT Description"
          placeholder="NFT Description"
        />
        <div className="flex flex-col gap-5">
          <TextInput
            onChange={handleQuestInputChange}
            value={questInput?.logo ?? ""}
            name="logo"
            label="Issuer Logo"
            placeholder="Issuer logo"
          />
          <input
            type="file"
            name="issuer_logo_file"
            className="border border-[#f4faff4d] rounded-lg p-2 w-80"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }
              const imageName = `${questInput.id}_issuer`;
              const imageUrl = `${process.env.NEXT_PUBLIC_API_LINK}/images/${imageName}`;
              try {
                await AdminService.uploadImage(file, imageName);
                setQuestInput((prev) => ({
                  ...prev,
                  logo: imageUrl,
                }));
                showNotification("Image uploaded successfully", "success");
              } catch (err) {
                showNotification(
                  err instanceof Error ? err.message : "Failed to upload image",
                  "error"
                );
              }
            }}
          />
        </div>

        <div className="flex gap-2 items-center">
          <p>Boost this quest</p>
          <Switch
            name="Boost this Quest"
            checked={showBoost}
            onChange={() => setShowBoost((prev) => !prev)}
          />
        </div>
      </div>
      {showBoost ? (
        <div className="flex flex-col w-full gap-8">
          <TextInput
            onChange={handleBoostInputChange}
            value={boostInput?.num_of_winners ?? ""}
            name="num_of_winners"
            label="Number of winners"
            placeholder="Number of winners"
          />
          <Dropdown
            value={boostInput?.token ? getTokenName(boostInput.token) : ""}
            backgroundColor="#101012"
            textColor="#fff"
            handleChange={handleBoostTokenChange}
            options={Object.keys(TOKEN_ADDRESS_MAP[network]).map((eachItem) => {
              return {
                value: TOKEN_ADDRESS_MAP[network][eachItem],
                label: eachItem,
              };
            })}
          />
          <TextInput
            onChange={handleBoostInputChange}
            value={boostInput?.amount ?? ""}
            name="amount"
            label="Amount"
            placeholder="Amount"
          />
        </div>
      ) : null}
      <div className="w-full sm:w-fit">
        <Button
          loading={buttonLoading}
          onClick={async () => await onSubmit()}
          disabled={submitButtonDisabled}
        >
          <p>Save Changes</p>
        </Button>
      </div>
    </div>
  );
};

export default RewardDetailsForm;
