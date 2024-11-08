import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const hidePortfolioAtom = atomWithStorage<boolean>("hidePortfolio", false);

export function useHidePortfolio() {
  const [hidePortfolio, setHidePortfolio] = useAtom(hidePortfolioAtom);

  return { hidePortfolio, setHidePortfolio };
}