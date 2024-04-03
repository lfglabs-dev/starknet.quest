import { Identity } from "../types/frontTypes";

export const hasVerifiedSocials = (identity: Identity) => {
  if (identity.old_discord || identity.old_twitter || identity.old_github) {
    return true;
  }
  return false;
};

export const memberSince = (timestamp: number): string | null => {
  const then = new Date(timestamp * 1000);
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - then.getTime();
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);

  const differenceInYears = Math.floor(differenceInSeconds / (3600 * 24 * 365));
  if (differenceInYears > 0) {
    return `Member since ${differenceInYears} ${
      differenceInYears > 1 ? "years" : "year"
    }`;
  }

  const differenceInMonths = Math.floor(differenceInSeconds / (3600 * 24 * 30));
  if (differenceInMonths > 0) {
    return `Member since ${differenceInMonths} ${
      differenceInMonths > 1 ? "months" : "month"
    }`;
  }

  const differenceInDays = Math.floor(differenceInSeconds / (3600 * 24));
  if (differenceInDays > 0) {
    return `Member since ${differenceInDays} ${
      differenceInDays > 1 ? "days" : "day"
    }`;
  }

  return null;
};
