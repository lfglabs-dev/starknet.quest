type QueryError = { error: string };


type QuestDocument = {
    id: number;
    name: string;
    issuer: string;
    category: string;
    to_win: ToWinItem[];
};

type ToWinItem = {
    type: string;
    name: string;
    desc: string;
    [key: string]: any;
};

type TaskDocument = {
    id: number;
    quest_id: number;
    name: string;
    description: string;
    href: string;
    cta?: string;
    verify_endpoint?: string;
};

type UserDocument = {
    address: string;
    exp: number;
};

type CompletedTaskDocument = {
    task_id: number;
    address: string;
};