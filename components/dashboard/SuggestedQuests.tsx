import React, { useContext, useEffect, useState } from "react";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import QuestStyles from "@styles/Home.module.css";
import QuestCardCustomised from "./CustomisedQuestCard";
import { QuestDocument } from "../../types/backTypes";
import { QuestsContext } from "@context/QuestsProvider";

const SuggestedQuests: React.FC = () => {
    const { quests: contextQuests } = useContext(QuestsContext);
    const [quests, setQuests] = useState<QuestDocument[]>([]);

    useEffect(() => {
        const onboardingQuests = contextQuests.filter((quest) => quest.category === "onboarding");
        setQuests(onboardingQuests);
    }, [contextQuests]);

    return (
        <div className="text-center">
            <Typography type={TEXT_TYPE.H1} className="title extrabold mb-3.5">New explorer, start your quest!</Typography>
            <div className="mb-12">Get started on your Starknet adventure by tackling your first quest and begin collecting rewards!</div>
            <div className={QuestStyles.questContainer}>
                {quests.map((quest) => (
                    <QuestCardCustomised key={quest.id} id={quest.id} />
                ))}
            </div>
        </div>
    );
};

export default SuggestedQuests;
