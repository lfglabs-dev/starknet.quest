import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement } from "chart.js";
import {
  Connector,
  IStarknetWindowObject,
  useAccount,
} from "@starknet-react/core";
import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "../../styles/profile.module.css";
import { useTheme } from "@mui/material/styles";

// initialize chart.js to create a custom pie chart
Chart.register(ArcElement);

const PieChart: FunctionComponent = () => {
  const { connector } = useAccount();
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

  useEffect(() => {
    if (connector && connector.id() === "braavos")
      setBraavosWallet(connector._wallet);
    console.log("connector", connector);
  }, [connector]);

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
