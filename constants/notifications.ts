export enum NotificationType {
  MINT_NFT = "MINT_NFT",
}

export const notificationMessages: Record<
  NotificationType,
  Record<"pending" | "success" | "error", string>
> = {
  [NotificationType.MINT_NFT]: {
    pending: "Transaction pending...",
    success: "NFT received",
    error: "Transaction failed",
  },
};
