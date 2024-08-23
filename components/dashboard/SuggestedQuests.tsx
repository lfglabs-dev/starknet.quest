import React, { useEffect, useState } from "react";
import Typography from "@components/UI/typography/typography";
import { TEXT_TYPE } from "@constants/typography";
import QuestStyles from "@styles/Home.module.css";
import QuestCardCustomised from "./CustomisedQuestCard";
import { getQuests } from "@services/apiService";
import { QuestDocument } from "../../types/backTypes";

const SuggestedQuests: React.FC = () => {
    const [quests, setQuests] = useState<QuestDocument[]>([]);

    useEffect(() => {
        const fetchQuests = async () => {
            const res = await getQuests();
            if (res && res.onboarding) {
                setQuests(res.onboarding.slice(0, 3));
            }
        };

        fetchQuests();
    }, []);

    return (
        <div>
            <Typography type={TEXT_TYPE.H1} className="title extrabold mb-3.5">New explorer, start your quest!</Typography>
            <div className="text-center	mb-12">Get started on your Starknet adventure by tackling your first quest and begin collecting rewards!</div>
            <div className={QuestStyles.questContainer}>
                {quests.map((quest) => (
                    <QuestCardCustomised key={quest.id} id={quest.id} />
                ))}
            </div>
        </div>
    );
};

export default SuggestedQuests;
