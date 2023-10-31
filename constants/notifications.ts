export enum NotificationType {
  TRANSACTION = "TRANSACTION",
}

export enum TransactionType {
  MINT_NFT = "MINT_NFT",
}

export const notificationTitle: Record<
  TransactionType,
  Record<"pending" | "success" | "error", string>
> = {
  [TransactionType.MINT_NFT]: {
    pending: "Transaction pending...",
    success: "NFT received",
    error: "Transaction failed",
  },
};

export const notificationLinkText: Record<NotificationType, string> = {
  [NotificationType.TRANSACTION]: "See transaction",
};
