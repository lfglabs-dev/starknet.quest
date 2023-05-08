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
import { minifyDomain } from "../../../../utils/stringService";
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
  const [twitterUsername, setTwitterUsername] = useState<string | undefined>();
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);

  useEffect(() => {
    starknetIdNavigator
      ?.getVerifierData(tokenId, "twitter")
      .then((response) => {
        if (response.toString(10) !== "0") {
          setTwitterId(response.toString(10));
        } else {
          setTwitterId(undefined);
          setTwitterUsername(undefined);
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

  useEffect(() => {
    if (twitterId) {
      fetch(`/api/twitter/get_username?id=${twitterId}`)
        .then((response) => response.json())
        // TO DO : Find how to import the twitter response type
        .then((data) => {
          setTwitterUsername(data[0].username);
        });
    }
  }, [twitterId]);

  return isOwner ? (
    <div className="mr-1">
      <Tooltip
        title={
          twitterUsername
            ? "Verify your twitter account on Starknet ID"
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
          {twitterUsername ? (
            <div className={styles.verifiedIcon}>
              <VerifiedIcon width={width} color={"green"} />
            </div>
          ) : null}
          <TwitterIcon width={width} color={"white"} />
        </div>
      </Tooltip>
    </div>
  ) : twitterUsername ? (
    <div className="mr-1">
      <Tooltip title={`Check ${minifyDomain(domain)} twitter`} arrow>
        <div
          className={styles.clickableIconTwitter}
          onClick={() => window.open(`https://twitter.com/${twitterUsername}`)}
        >
          <TwitterIcon width={width} color={"white"} />
        </div>
      </Tooltip>
    </div>
  ) : null;
};

export default ClickableTwitterIcon;
