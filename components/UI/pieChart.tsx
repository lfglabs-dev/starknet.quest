import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import { useConnectors } from "@starknet-react/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/profile.module.css";
import { useTheme } from "@mui/material/styles";

// initialize chart.js to create a custom pie chart
Chart.register(ArcElement);

const PieChart: FunctionComponent = () => {
  const { connectors } = useConnectors();
  const [braavosWallet, setBraavosWallet] = useState<null | any>(null);
  const [pieData, setPieData] = useState<number[]>([0, 100]);
  const theme = useTheme();

  const data = {
    datasets: [
      {
        data: pieData,
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.background.default,
        ],
        display: true,
        borderColor: theme.palette.background.default,
      },
    ],
  };

  if (connectors) {
    // connectors is of type Connector<any> in starknet-react
    // but _wallet which is supposed to be of type IStarknetWindowObject is set as private
    const wallet: any = connectors.filter((wallet: any) => {
      return (
        wallet._wallet &&
        wallet._wallet.id === "braavos" &&
        wallet._wallet.isConnected === true
      );
    });
    setBraavosWallet(wallet[0]?._wallet);
  }

  useEffect(() => {
    if (!braavosWallet) return;
    braavosWallet
      .request({ type: "wallet_getStarknetProScore" })
      .then((score: BraavosScoreProps) => {
        setPieData([score.score, 100 - score.score]);
      });
  }, [braavosWallet]);

  return (
    <>
      <div className={styles.analyticsTitle}>Your Braavos score</div>
      <div>
        <Doughnut
          data={data}
          options={{
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                enabled: false,
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
            bottom: "15%",
            left: "50%",
            transform: "translate(-50%, 15%)",
            textAlign: "center",
          }}
        >
          <div className={styles.braavosScore}>{pieData[0]}%</div>
        </div>
      </div>
    </>
  );
};

export default PieChart;
