import { BN } from "bn.js";

export function minifyAddress(address: string | undefined, length = 4): string {
  if (!address) return "";

  const firstPart = address.substring(0, length);
  const secondPart = address.substring(
    address.length - length + 1,
    address.length
  );

  return (firstPart + "..." + secondPart).toLowerCase();
}

export function minifyAddressWithChars(
  address: string | undefined,
  chars: number
): string {
  if (!address) return "";

  if (address.length <= chars * 2) return address.toLowerCase();

  const firstPart = address.substring(0, chars);
  const secondPart = address.substring(address.length - chars, address.length);

  return (firstPart + "..." + secondPart).toLowerCase();
}

export function shortenDomain(
  domain?: string,
  characterToBreak?: number
): string {
  if (!domain) return "";

  if (domain.length > (characterToBreak ?? 20)) {
    const firstPart = domain.substring(0, 4);
    const secondPart = domain.substring(domain.length - 3, domain.length);

    return (firstPart + "..." + secondPart).toLowerCase();
  } else {
    return domain.toLowerCase();
  }
}

export function minifyDomain(
  domain: string,
  characterToBreak?: number
): string {
  if (domain.length > (characterToBreak ?? 18)) {
    const firstPart = domain.substring(0, 4);
    return (firstPart + "...").toLowerCase();
  } else {
    return domain.toLowerCase();
  }
}

export function is1234Domain(domain: string): boolean {
  return /^\d{4}$/.test(domain) && parseInt(domain) < 1234;
}

export function getDomainWithoutStark(str: string | undefined): string {
  if (!str) return "";

  if (str.endsWith(".stark")) {
    return str.slice(0, str.length - 6);
  } else {
    return str;
  }
}

export function isHexString(str: string): boolean {
  if (str === "") return true;
  return /^0x[0123456789abcdefABCDEF]+$/.test(str);
}

export function generateString(length: number, characters: string): string {
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

export function numberToString(element: number | undefined): string {
  if (element === undefined) return "";

  return new BN(element).toString(10);
}
// a function that take a number as a string like 1111 and convert it to 000000001111
export function convertNumberToFixedLengthString(number: string): string {
  if (!number) return "000000000000";
  return number.padStart(12, "0");
}

export const getMonthName = (index: number): string => {
  switch (index) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "";
  }
};
