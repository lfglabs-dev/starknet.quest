import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { useConnectors } from "@starknet-react/core";
import { useEffect, useState } from "react";

Chart.register(ArcElement);

const PieChart = () => {
  const { connectors } = useConnectors();
  const [braavosWallet, setBraavosWallet] = useState<null | any>(null);
  const [pieData, setPieData] = useState<number[]>([0, 100]);

  const data = {
    datasets: [
      {
        data: pieData,
        backgroundColor: ["#6affaf", "#5ce3fe"],
        display: true,
        borderColor: "#101012",
      },
    ],
  };

  useEffect(() => {
    if (connectors) {
      const wallet = connectors.filter((wallet: any) => {
        return (
          wallet._wallet &&
          wallet._wallet.id === "braavos" &&
          wallet._wallet.isConnected === true
        );
      });
      // @ts-ignore
      setBraavosWallet(wallet[0]._wallet);
    }
  }, [connectors]);

  useEffect(() => {
    if (!braavosWallet) return;
    braavosWallet
      .request({ type: "wallet_getStarknetProScore" })
      .then((score: BraavosScoreProps) => {
        setPieData([score.score, 100 - score.score]);
      });
  }, [braavosWallet]);

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
