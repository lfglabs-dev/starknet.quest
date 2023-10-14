import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { StarknetIdJsContext } from "../../context/StarknetIdJsProvider";
import ProfilIcon from "./iconsComponents/icons/profilIcon";
import theme from "../../styles/theme";

type AvatarProps = {
  address: string;
  width?: string;
};

const Avatar: FunctionComponent<AvatarProps> = ({ address, width = "32" }) => {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [starknetId, setStarknetId] = useState<string>("");

  useEffect(() => {
    if (!address) return;
    (async () => {
      const domain = await starknetIdNavigator?.getStarkName(address);
      if (!domain) return;
      const starknetId = await starknetIdNavigator?.getStarknetId(domain);
      if (!starknetId) return;
      setStarknetId(starknetId.toString());
    })();
  }, [address]);

  return (
    <>
      {starknetId ? (
        <img
          src={`https://goerli.starknet.id/api/identicons/${starknetId}`}
          width={width}
          height={width}
          className="rounded-full"
        />
      ) : (
        <ProfilIcon width={width} color={theme.palette.secondary.main} />
      )}
    </>
  );
};

export default Avatar;
