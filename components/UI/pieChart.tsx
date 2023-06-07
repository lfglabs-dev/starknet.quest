import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { useConnectors } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { getStarknet } from "get-starknet-core";

Chart.register(ArcElement);

const data = {
  datasets: [
    {
      data: [60, 30],
      backgroundColor: ["#6affaf", "#5ce3fe"],
      display: true,
      borderColor: "#101012",
    },
  ],
};

// once having a reference to the wallet object, you can call -
// `wallet.request({ type: "wallet_getStarknetProScore" })`
// and it will return -
// ```
// {
//    score: number; // overall scroll
//     protocols: string[]; // ids of protocols from https://github.com/myBraavos/starknet-meta
// }
// ```
// so, you'll have both the final score and the protocols/dapp with which the current account has interacted.

const PieChart = () => {
  const { connectors } = useConnectors();
  const [braavosWallet, setBraavosWallet] = useState<null | any>(null);

  useEffect(() => {
    if (connectors) {
      const wallet = connectors.filter((wallet: any) => {
        return (
          wallet._wallet &&
          wallet._wallet.id === "braavos" &&
          wallet._wallet.isConnected === true
        );
      });
      setBraavosWallet(wallet[0]._wallet);
    }
    // const starknet = getStarknet();
    // starknet.getAvailableWallets().then((installed) => {
    //   const wallet = installed.filter(
    //     (w) => w.id === "braavos" && w.isConnected == true
    //   )[0];
    //   console.log("wallet", wallet);
    //   if (wallet) {
    //     setBraavosWallet(wallet);
    //   }
    // });
  }, [connectors]);

  useEffect(() => {
    if (!braavosWallet) return;
    braavosWallet
      .request({ type: "wallet_getStarknetProScore" })
      .then((res: any) => {
        console.log("res", res);
      });
  }, [braavosWallet]);

  console.log("wallet", braavosWallet);
  return (
    <div>
      <Doughnut
        data={data}
        options={{
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: true,
            },
          },
          rotation: -90,
          circumference: 180,
          cutout: "60%",
          maintainAspectRatio: true,
          responsive: true,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <div>Your Starknet score</div>
      </div>
    </div>
  );
};

export default PieChart;
