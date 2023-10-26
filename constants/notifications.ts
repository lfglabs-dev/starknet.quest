export enum NotificationType {
  TRANSACTION = "TRANSACTION",
}

export enum TransactionType {
  MINT_NFT = "MINT_NFT",
}

export const notificationMessages: Record<
  TransactionType,
  Record<"pending" | "success" | "error", string>
> = {
  [TransactionType.MINT_NFT]: {
    pending: "Transaction pending...",
    success: "NFT received",
    error: "Transaction failed",
  },
};
