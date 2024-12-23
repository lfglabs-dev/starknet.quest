import { formatNumber } from "@utils/numberService";
/**
 * Props for the DeFi Opportunity Card component
 */
interface PoolCardProps {
  /** Token pair identifier (e.g., "STRK-ETH") */
  tokenPair: string;
  /** Type of DeFi opportunity */
  type: string;
  /** Annual Percentage Rate (APR) */
  apr: number;
  /** Total Value Locked in millions */
  tvl: number;
  /** Daily rewards amount or lock period in days */
  dailyRewards: number;
  protocol: {
    name: string;
    icon?: string;
  };
  token1Icon?: string;
  token2Icon?: string;
}

export default function DefiOpportunityCardComponent({
  tokenPair,
  type,
  apr,
  tvl,
  dailyRewards,
  protocol = {
    name: "",
    icon: "",
  },
  token1Icon,
  token2Icon,
}: PoolCardProps) {
  return (
    <div className="w-full bg-[#1F1F25] py-4 rounded-lg mt-6 lg:mt-0 _border _box-shadow">
      <div className="w-full flex justify-between items-start mb-2 relative px-4">
        <div>
          <h2 className="text-[18px] md:text-[14px] xl:text-[24px] font-[700] text-white mb-1">
            {tokenPair}
          </h2>
          <p className="text-[12px] md:text-[10px] xl:text-[14px] font-[400] gradient-text">
            {type}
          </p>
        </div>
        <div className="flex items-center justify-center -space-x-6 -mt-10">
          {token1Icon ? (
            <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[48px] md:h-[48px] xl:w-[60px] xl:h-[60px] rounded-full overflow-hidden">
              <img
                src={token1Icon}
                alt="Token 1"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            ""
          )}
          {token2Icon ? (
            <div className="w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] md:w-[48px] md:h-[48px] xl:w-[60px] xl:h-[60px] rounded-full overflow-hidden">
              <img
                src={token2Icon}
                alt="Token 2"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>

      <div className="w-full grid grid-cols-3 gap-0 my-8 divide-x-[1px] divide-[#29282B]">
        <div className="w-full mx-auto flex flex-col items-center justify-center text-center">
          <p className="text-[#A6A5A7] text-[10px] min-[410px]:text-[12px] md:text-[8px] lg:text-[10px] 2xl:text-[12px] font-[400] mb-1.5">
            APR
          </p>
          <p className="text-[14px] min-[410px]:text-[18px] sm:text-[16px] md:text-[14px] 2xl:text-[20px] font-[700] text-[#F4FAFF]">
            {formatNumber(apr, { style: "percent", maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="w-full mx-auto flex flex-col items-center justify-center text-center">
          <p className="text-[#A6A5A7] text-[10px] min-[410px]:text-[12px] md:text-[8px] lg:text-[10px] 2xl:text-[12px] font-[400] mb-1.5">
            TVL
          </p>
          <p className="text-[14px] min-[410px]:text-[18px] sm:text-[16px] md:text-[14px] 2xl:text-[20px] font-[700] text-[#F4FAFF]">
            {formatNumber(tvl, {
              style: "currency",
              currency: "USD",
              notation: "compact",
            })}
          </p>
        </div>
        <div className="w-full mx-auto flex flex-col items-center justify-center text-center">
          <p className="text-[#A6A5A7] text-[10px] min-[410px]:text-[12px] md:text-[8px] lg:text-[10px] 2xl:text-[12px] font-[400] mb-1.5">
            {type == "Staking" ? "Lock Period" : "Daily Rewards"}
          </p>
          <p className="text-[14px] min-[410px]:text-[18px] sm:text-[16px] md:text-[14px] 2xl:text-[20px] font-[700] text-[#F4FAFF]">
            {type === "Staking"
              ? `${dailyRewards} days`
              : formatNumber(dailyRewards, {
                  style: "currency",
                  currency: "USD",
                })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-x-8 w-full px-4">
        <p className="text-[10px] sm:text-[12px] font-[400] text-[#A6A5A7] w-full">
          Protocol
        </p>
        <div className="flex items-center gap-1.5 flex-none w-auto">
          <div className="w-[12px] h-[12px] sm:w-[16px] sm:h-[16px] rounded-full overflow-hidden">
            {protocol.icon ? (
              <img
                src={protocol.icon}
                alt={`${protocol.name} icon`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-600" />
            )}
          </div>
          <span className="text-[#F4FAFF] text-[10px] sm:text-[12px] font-[400]">
            {protocol.name}
          </span>
        </div>
      </div>
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(90deg, #6affaf -0.12%, #5ce3fe 99.88%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        ._box-shadow {
          box-shadow: 0px 2px 10px 0px #627eea29;
        }
        ._border {
          position: relative;
          border-top: 1px solid transparent;
          border-right: 1px solid transparent;
          background-image: linear-gradient(
              to left,
              rgba(41, 41, 106, 0.8) 0,
              rgba(41, 41, 106, 0) 150%
            ),
            linear-gradient(
              to bottom,
              rgba(41, 41, 106, 0.8),
              rgba(41, 41, 106, 0) 50%
            );
          background-position: top right, top right;
          background-repeat: no-repeat;
          background-size: 100% 2px, 2px 100%;
        }
      `}</style>
    </div>
  );
}
