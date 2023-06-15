import { Tooltip } from "@mui/material";
import { useRouter } from "next/router";
import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import TwitterIcon from "../../../UI/iconsComponents/icons/twitterIcon";
import VerifiedIcon from "../../../UI/iconsComponents/icons/verifiedIcon";
import styles from "../../../../styles/components/icons.module.css";
import { StarknetIdJsContext } from "../../../../context/StarknetIdJsProvider";

type ClickableTwitterIconProps = {
  width: string;
  tokenId: string;
  isOwner: boolean;
  domain: string;
};

const ClickableTwitterIcon: FunctionComponent<ClickableTwitterIconProps> = ({
  width,
  tokenId,
  isOwner,
  domain,
}) => {
  const router = useRouter();
  const [twitterId, setTwitterId] = useState<string | undefined>();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);

  useEffect(() => {
    starknetIdNavigator
      ?.getVerifierData(tokenId, "twitter")
      .then((response) => {
        if (response.toString(10) !== "0") {
          setTwitterId(response.toString(10));
        } else {
          setTwitterId(undefined);
        }
      })
      .catch(() => {
        return;
      });
  }, [tokenId, domain]);

  function startVerification(link: string): void {
    sessionStorage.setItem("tokenId", tokenId);
    router.push(link);
  }

  return isOwner ? (
    <div className="mr-1">
      <Tooltip
        title={
          twitterId
            ? "Change your twitter account on Starknet ID"
            : "Start twitter verification"
        }
        arrow
      >
        <div
          className={styles.clickableIconTwitter}
          onClick={() =>
            startVerification(
              `${process.env.NEXT_PUBLIC_STARKNETID_APP_LINK}/identities`
            )
          }
        >
          {twitterId ? (
            <div className={styles.verifiedIcon}>
              <VerifiedIcon width={"18"} color={"green"} />
            </div>
          ) : null}
          <TwitterIcon width={width} color={"white"} />
        </div>
      </Tooltip>
    </div>
  ) : null;
};

export default ClickableTwitterIcon;
