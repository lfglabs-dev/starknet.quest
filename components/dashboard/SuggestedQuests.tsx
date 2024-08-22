import React from "react";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import QuestStyles from "@styles/Home.module.css";
import QuestCardCustomised from "./CustomisedQuestCard";

const SuggestedQuests: React.FC = () => {
    return (
        <div>
            <Typography type={TEXT_TYPE.H1} className="title extrabold mb-3.5">New explorer, start your quest!</Typography>
            <div className="text-center	mb-12">Get started on your Starknet adventure by tackling your first quest and begin collecting rewards!</div>
            <div className={QuestStyles.questContainer}>
                <QuestCardCustomised key={27} id={27} />
                <QuestCardCustomised key={27} id={27} />
                <QuestCardCustomised key={27} id={27} />
            </div>
        </div>
    );
};

export default SuggestedQuests;