import React, { FunctionComponent } from "react";
import TextInput from "../textInput";
import { SelectChangeEvent, Switch } from "@mui/material";
import {
  CreateQuest,
  NFTUri,
  UpdateBoost,
  UpdateQuest,
} from "../../../types/backTypes";
import Button from "@components/UI/button";
import { boostDefaultInput } from "@constants/admin";
import { getTokenName } from "@utils/tokenService";
import { TOKEN_ADDRESS_MAP, TOKEN_DECIMAL_MAP } from "@constants/common";
import { getCurrentNetwork } from "@utils/network";
import Dropdown from "@components/UI/dropdown";

type RewardDetailsFormProps = {
  handleQuestInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBoostInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleQuestImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  questInput: CreateQuest | UpdateQuest;
  boostInput: typeof boostDefaultInput | UpdateBoost;
  nfturi: NFTUri;
  setNftUri: React.Dispatch<React.SetStateAction<NFTUri>>;
  setQuestInput:
    | React.Dispatch<React.SetStateAction<CreateQuest>>
    | React.Dispatch<React.SetStateAction<UpdateQuest>>;
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
}) => {
  const network = getCurrentNetwork();

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
        <TextInput
          onChange={handleQuestImageChange}
          value={nfturi?.image}
          name="nft_image"
          label="NFT Image Path"
          placeholder="NFT Image Path"
        />

        <TextInput
          onChange={(e) => {
            setNftUri((prev) => ({
              ...prev,
              description: e.target.value,
            }));
          }}
          value={nfturi?.description ?? ""}
          name="nft_image"
          label="NFT Description"
          placeholder="NFT Description"
        />
        <TextInput
          onChange={handleQuestInputChange}
          value={questInput?.logo ?? ""}
          name="logo"
          label="Issuer Logo"
          placeholder="Issuer logo"
        />
        <div className="flex gap-2 items-center">
          <p>Boost this quest</p>
          <Switch
            name="Boost this Quest"
            value={showBoost}
            onChange={() => setShowBoost((prev) => !prev)}
          />
        </div>
      </div>
      {showBoost ? (
        <div className="flex flex-col w-full gap-8">
          <TextInput
            onChange={handleBoostInputChange}
            value={boostInput.num_of_winners ?? ""}
            name="num_of_winners"
            label="Number of winners"
            placeholder="Number of winners"
          />
          <Dropdown
            value={boostInput.token ? getTokenName(boostInput.token) : ""}
            backgroundColor="#101012"
            textColor="#fff"
            handleChange={(event: SelectChangeEvent) => {
              setBoostInput((prev: any) => ({
                ...prev,
                token: event.target.value,
                // token decimals is a value which has different tokens which we support and use their decimals here
                token_decimals:
                  TOKEN_DECIMAL_MAP[
                    event.target.value as keyof typeof TOKEN_DECIMAL_MAP
                  ],
              }));
            }}
            options={Object.keys(TOKEN_ADDRESS_MAP[network]).map((eachItem) => {
              return {
                value: eachItem,
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
      <div className="w-fit">
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
