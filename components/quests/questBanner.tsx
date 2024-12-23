import { FunctionComponent } from "react";
import styles from "@styles/quests.module.css";
import Button from "@components/UI/button";
import type { Banner } from "types/backTypes";

type QuestBannerProps = {
  banner: Banner;
};

const QuestBanner: FunctionComponent<QuestBannerProps> = ({ banner }) => {
  return banner ? (
    <div className={styles.questBanner}>
      <div
        className={styles.questBannerImage}
        style={{ backgroundImage: `url(${banner.image})` }}
      />
      <div className={styles.questBannerContent}>
        <h2 className={styles.questBannerTitle}>
          {banner.tag ? (
            <span className={styles.bannerTag}>{banner.tag} - </span>
          ) : null}
          {banner.title}
        </h2>
        <p>{banner.description}</p>
        {banner.cta ? (
          <div className="w-fit">
            <Button
              onClick={() => {
                window.open(banner.href, "_blank");
              }}
            >
              {banner.cta}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default QuestBanner;
