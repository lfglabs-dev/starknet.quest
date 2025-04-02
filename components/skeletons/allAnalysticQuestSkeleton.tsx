import { Skeleton } from "@mui/material";
import analyticsStyles from "@styles/analytics.module.css";

export const QuestHeaderSkeleton = () => (
  <div className="flex flex-col items-center gap-4 mb-16">
    <div className={analyticsStyles.tag}>
      <Skeleton
        variant="circular"
        width={20}
        height={20}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton variant="text" width={120} sx={{ bgcolor: "grey.900" }} />
    </div>
    <Skeleton
      variant="text"
      width={300}
      height={48}
      sx={{ bgcolor: "grey.900" }}
    />
    <Skeleton
      variant="text"
      width={100}
      height={24}
      sx={{ bgcolor: "grey.900" }}
    />
  </div>
);

export const MetricCardSkeleton = () => (
  <div className={analyticsStyles.dataCard}>
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Skeleton
        variant="text"
        width={120}
        height={24}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="text"
        width={80}
        height={32}
        sx={{ bgcolor: "grey.900" }}
      />
      <div className="flex flex-wrap items-baseline gap-2">
        <Skeleton
          variant="text"
          width={60}
          height={24}
          sx={{ bgcolor: "grey.900" }}
        />
        <Skeleton
          variant="text"
          width={100}
          height={20}
          sx={{ bgcolor: "grey.900" }}
        />
      </div>
    </div>
  </div>
);

export const GraphSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div className={`${analyticsStyles.dataCard} max-w-[950px] w-full`}>
    <div className="flex flex-col w-full gap-1 mb-6">
      <Skeleton
        variant="text"
        width={200}
        height={24}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="text"
        width={250}
        height={32}
        sx={{ bgcolor: "grey.900" }}
      />
    </div>
    <Skeleton
      variant="rectangular"
      width="100%"
      height={isMobile ? 200 : 300}
      sx={{ bgcolor: "grey.900", borderRadius: "8px" }}
    />
  </div>
);

export const TasksSkeleton = () => (
  <div className={analyticsStyles.tasksContainer}>
    <div className="flex flex-col w-full gap-1 mb-6">
      <Skeleton
        variant="text"
        width={200}
        height={24}
        sx={{ bgcolor: "grey.900" }}
      />
      <Skeleton
        variant="text"
        width={100}
        height={32}
        sx={{ bgcolor: "grey.900" }}
      />
    </div>
    <div className="flex flex-wrap justify-center w-full gap-6">
      {[1, 2, 3].map((index) => (
        <div key={index} className="flex w-full max-w-none sm:max-w-[245px]">
          <div className={analyticsStyles.dataCard}>
            <Skeleton
              variant="text"
              width={120}
              height={24}
              sx={{ bgcolor: "grey.900" }}
            />
            <Skeleton
              variant="text"
              width={80}
              height={32}
              sx={{ bgcolor: "grey.900" }}
            />
            <div className="flex flex-wrap items-baseline gap-2">
              <Skeleton
                variant="text"
                width={60}
                height={24}
                sx={{ bgcolor: "grey.900" }}
              />
              <Skeleton
                variant="text"
                width={100}
                height={20}
                sx={{ bgcolor: "grey.900" }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
