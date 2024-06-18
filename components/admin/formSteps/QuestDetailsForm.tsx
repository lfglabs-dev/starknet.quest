import React, { FunctionComponent } from "react";
import TextInput from "../textInput";
import { CATEGORY_OPTIONS } from "@constants/admin";
import { CreateQuest, UpdateQuest } from "../../../types/backTypes";
import DateInput from "../dateInput";
import { getUserFromJwt } from "@utils/jwt";
import styles from "@styles/admin.module.css";
import { TEXT_TYPE } from "@constants/typography";
import Typography from "@components/UI/typography/typography";
import Button from "@components/UI/button";

type QuestDetailsFormProps = {
  handleQuestInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  questInput: CreateQuest | UpdateQuest;
  startTime: string;
  endTime: string;
  setStartTime: React.Dispatch<React.SetStateAction<string>>;
  setEndTime: React.Dispatch<React.SetStateAction<string>>;
  setQuestInput:
    | React.Dispatch<React.SetStateAction<CreateQuest>>
    | React.Dispatch<React.SetStateAction<UpdateQuest>>;
  onSubmit: () => void;
  submitButtonDisabled: boolean;
};

const QuestDetailsForm: FunctionComponent<QuestDetailsFormProps> = ({
  questInput,
  handleQuestInputChange,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  setQuestInput,
  onSubmit,
  submitButtonDisabled,
}) => {
  const currentUser = getUserFromJwt();
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <TextInput
          onChange={handleQuestInputChange}
          value={questInput.name ?? ""}
          name="name"
          label="Name"
          placeholder="Enter a name"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Provide a brief, descriptive name for the quest.
        </Typography>
      </div>
      <div className="flex flex-col gap-1">
        <TextInput
          onChange={handleQuestInputChange}
          value={questInput.title_card ?? ""}
          name="title_card"
          label="Title"
          placeholder="Enter a title"
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Provide a title which will be displayed in the card.
        </Typography>
      </div>

      {currentUser === "super_user" ? (
        <div className="flex flex-col gap-1">
          <TextInput
            onChange={handleQuestInputChange}
            value={questInput.issuer ?? ""}
            name="issuer"
            label="Issuer"
            placeholder="Issuer name"
          />
          <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
            Name of the issuer of the quest
          </Typography>
        </div>
      ) : null}

      <div className="flex flex-col gap-1">
        <TextInput
          onChange={handleQuestInputChange}
          value={questInput.desc}
          name="desc"
          label="Description"
          placeholder="Quest Description"
          multiline={4}
        />
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Give a concise overview of the quest&apos;s objectives and tasks.
        </Typography>
      </div>

      <div className="w-full flex justify-between gap-4">
        <div className="flex-1 w-full">
          <div className="flex flex-col gap-1">
            <DateInput
              onChange={(value) => {
                setStartTime((value * 1000).toString());
              }}
              value={startTime}
              label="Start Date"
              placeholder="Start Date"
              name="start_time"
            />
            <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
              Select the quest&apos;s start date.
            </Typography>
          </div>
        </div>
        <div className="flex-1 w-full">
          <div className="flex flex-col gap-1">
            <DateInput
              onChange={(value) => {
                setEndTime((value * 1000).toString());
              }}
              value={endTime}
              label="End Date"
              placeholder="End Date"
              name="expiry"
            />
            <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
              Select the quest&apos;s end date.
            </Typography>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p>Category</p>
        <div className="flex flex-row w-full gap-2 px-4 py-3 rounded-xl border-[1px] border-[#f4faff4d]">
          {CATEGORY_OPTIONS.map((category) => (
            <div
              onClick={() => {
                setQuestInput((prev) => ({ ...prev, category }));
              }}
              key={"category" + category}
              className="py-3 px-5 rounded-xl w-fit"
              style={{
                cursor: "pointer",
                backgroundColor:
                  questInput.category === category ? "#ffffff" : "#29282B",
                color: questInput.category === category ? "#29282B" : "#ffffff",
              }}
            >
              <p className={styles.tagText}>{category}</p>
            </div>
          ))}
        </div>
        <Typography type={TEXT_TYPE.BODY_MICRO} color="textGray">
          Choose a category that best fits the quest.
        </Typography>
      </div>
      <div className="w-fit">
        <Button onClick={onSubmit} disabled={submitButtonDisabled}>
          <p>Save Changes</p>
        </Button>
      </div>
    </div>
  );
};

export default QuestDetailsForm;
