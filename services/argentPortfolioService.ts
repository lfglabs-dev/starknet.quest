import {
  ArgentDapp,
  ArgentDappMap,
  ArgentUserDapp,
  ArgentToken,
  ArgentTokenValue,
  ArgentTokenMap,
  ArgentUserToken,
} from "types/backTypes";

const API_BASE = "https://cloud.argent-api.com";
const API_VERSION = "v1";
const API_HEADERS = {
  "argent-client": "portfolio",
  "argent-network": "mainnet",
  "argent-version": "1.4.3",
  "content-type": "application/json",
  "referer": "https://portfolio.argent.xyz/",
};

const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_INITIAL_DELAY = 2000; // in milliseconds
const DEFAULT_MAX_DELAY = 10000; // Cap maximum delay at 10 seconds
const DEFAULT_BACKOFF_FACTOR = 2;

const fetchData = async <T>(endpoint: string, { signal }: { signal?: AbortSignal }): Promise<T> => {
  try {
    const response = await fetch(endpoint, { headers: API_HEADERS, signal });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    return await response.json();
  } catch (err) {
    console.log("Error fetching data from Argent API", err);
    throw err;
  }
};

const fetchDataWithRetry = async <T>(
  endpoint: string,
  options?: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffFactor?: number;
    filterErrorRetryable?: (error: Error) => boolean;
    signal?: AbortSignal;
  }
): Promise<T> => {
  const maxRetries = options?.maxRetries ?? DEFAULT_MAX_RETRIES;
  const initialDelay = options?.initialDelay ?? DEFAULT_INITIAL_DELAY;
  const maxDelay = options?.maxDelay ?? DEFAULT_MAX_DELAY;
  const backoffFactor = options?.backoffFactor ?? DEFAULT_BACKOFF_FACTOR;
  const filterErrorRetryable = options?.filterErrorRetryable ?? (() => true);
  const { signal } = options ?? {};
  let retries = 0;
  let delay = initialDelay;
  let lastError: Error = new Error('No request attempted');

  while (retries <= maxRetries) {
    try {
      return await fetchData<T>(endpoint, { signal });
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Prevent abort errors from being retried
      if (lastError.name === 'AbortError') {
        throw lastError;
      }

      if (!filterErrorRetryable(lastError)) {
        throw lastError;
      }

      if (retries === maxRetries) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * backoffFactor, maxDelay); // Cap the delay
      retries++;
    }
  }

  throw new Error(
    `Failed after ${maxRetries} retries. Endpoint: ${endpoint}. Error: ${lastError.message}`
  );
};

export const fetchDapps = async ({ signal }: { signal?: AbortSignal }) => {
  const data = await fetchDataWithRetry<ArgentDapp[]>(`${API_BASE}/${API_VERSION}/tokens/dapps?chain=starknet`, { signal });
  return Object.fromEntries(data.map((dapp) => [dapp.dappId, dapp])) as ArgentDappMap;
};

export const fetchTokens = async ({ signal }: { signal?: AbortSignal }) => {
  const data = await fetchDataWithRetry<{ tokens: ArgentToken[] }>(`${API_BASE}/${API_VERSION}/tokens/info?chain=starknet`, { signal });
  return Object.fromEntries(data.tokens.map((token) => [token.address, token])) as ArgentTokenMap;
};

export const fetchUserTokens = async (walletAddress: string, { signal }: { signal?: AbortSignal }) => {
  const data = await fetchDataWithRetry<{ balances: ArgentUserToken[], status: string }>(`${API_BASE}/${API_VERSION}/activity/starknet/mainnet/account/${walletAddress}/balance`, { signal });
  return data.balances;
};

export const fetchUserDapps = async (walletAddress: string, { signal }: { signal?: AbortSignal }) => {
  const data = await fetchDataWithRetry<{ dapps: ArgentUserDapp[] }>(
    `${API_BASE}/${API_VERSION}/tokens/defi/${walletAddress}/investments?chain=starknet&application=webwallet`,
    { signal }
  );
  return data.dapps;
};

export const calculateTokenPrice = async (
  tokenAddress: string,
  tokenAmount: string,
  currency: "USD" | "EUR" | "GBP" = "USD",
  { signal }: { signal?: AbortSignal } = {}
) => {
  let data: ArgentTokenValue;
  try {
    data = await fetchDataWithRetry<ArgentTokenValue>(
      `${API_BASE}/${API_VERSION}/tokens/prices/${tokenAddress}?chain=starknet&currency=${currency}`,
      {
        filterErrorRetryable: (error) => !error.message.includes('No price for token'),
        signal
      }
    );
  } catch (err) {
    if (err instanceof Error && err.message.includes('No price for token')) {
      return 0;
    }
    throw err;
  }
  try {
    return Number(tokenAmount) * Number(data.ccyValue);
  } catch (err) {
    console.log("Error while calculating token price", err);
    throw err;
  }
};

export const calculateTotalBalance = async (
  walletAddress: string,
  currency: "USD" | "EUR" | "GBP" = "USD",
  { signal }: { signal?: AbortSignal } = {} 
): Promise<number> => {
  try {
    const tokens = await fetchUserTokens(walletAddress, { signal }); // Fetch all tokens in wallet
    let totalBalance = 0;

    for (const token of tokens) {
      try {
        // Adjust token balance by dividing by 10^18, then calculate its price
        const tokenInfo = await fetchTokens({ signal });
        const decimals = tokenInfo[token.tokenAddress]?.decimals ?? 18;
        const adjustedBalance = Number(token.tokenBalance) / 10 ** decimals;
        const tokenValue = await calculateTokenPrice(
          token.tokenAddress,
          adjustedBalance.toString(),
          currency
        );
        totalBalance += tokenValue;
      } catch (err) {
        console.error(
          `Error calculating price for token ${token.tokenAddress}:`,
          err
        );
      }
    }

    return totalBalance;
  } catch (err) {
    console.error("Error calculating total balance:", err);
    throw err;
  }
};
