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
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    (async () => {
      const domain = await starknetIdNavigator?.getStarkName(address);
      if (!domain) return;
      const starknetId = await starknetIdNavigator?.getStarknetId(domain);
      if (!starknetId) return;
      setStarknetId(starknetId);
    })();
  }, [address]);

  useEffect(() => {
    if (!address || !starknetIdNavigator) return;
    (async () => {
      const data = await starknetIdNavigator?.getProfileData(address);
      if (!data) return;
      if (data.profilePicture) setAvatar(data.profilePicture);
      else setAvatar(null);
    })();
  }, [address, starknetId, starknetIdNavigator]);

  return (
    <>
      {starknetId ? (
        <img
          src={
            avatar ??
            `${process.env.NEXT_PUBLIC_STARKNET_ID_LINK}/api/identicons/${starknetId}`
          }
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
