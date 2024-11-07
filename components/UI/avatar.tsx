import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import ProfilIcon from "@components/UI/iconsComponents/icons/profilIcon";
import theme from "@styles/theme";
import { StarknetIdJsContext } from "@context/StarknetIdJsProvider";
import { StarkProfile } from "starknetid.js";

type AvatarProps = {
  address: string;
  width?: string;
};

const Avatar: FunctionComponent<AvatarProps> = ({ address, width = "32" }) => {
  const { starknetIdNavigator } = useContext(StarknetIdJsContext);
  const [profile, setProfile] = useState<StarkProfile | null>(null);

  useEffect(() => {
    if (!starknetIdNavigator) return;
    starknetIdNavigator.getProfileData(address).then((profile) => {
      setProfile(profile);
    });
  }, [starknetIdNavigator, address]);
  return (
    <>
      {profile?.profilePicture ? (
        <img
          src={profile?.profilePicture}
          width={width}
          height={width}
          className="rounded-full"
          alt={`${profile?.name?.length !== 0 ? profile?.name : "User"}'s avatar`}
        />
      ) : (
        <ProfilIcon width={width} color={theme.palette.secondary.main} />
      )}
    </>
  );
};

export default Avatar;
