import React, { FunctionComponent, useState } from "react";
import BottomArrow from "../../public/icons/dropdownArrow.svg";
import Image from "next/image";
import { PAGE_SIZE, timeFrameMap } from "../../utils/constants";
import styles from "../../styles/leaderboard.module.css";
import ChevronLeftIcon from "../UI/iconsComponents/icons/chevronLeftIcon";
import ChevronRightIcon from "../UI/iconsComponents/icons/ChevronRightIcon";

// this will contain the pagination arrows and page size limit controls
const ControlsDashboard: FunctionComponent<ControlsDashboardProps> = ({
  ranking,
  handlePagination,
  rowsPerPage,
  setRowsPerPage,
  leaderboardToppers,
  duration,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <div className={styles.controls_layout_container}>
      <div className={styles.controls_left_container}>
        <p className={styles.rows_text}>Rows per page</p>
        <div
          className={styles.controls_page_limit_dropdown_container}
          aria-selected={showMenu}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <div className={styles.controls_option_display}>
            <p>{rowsPerPage}</p>
            <Image src={BottomArrow} priority />
          </div>
          {showMenu ? (
            <div className={styles.pages_menu}>
              {PAGE_SIZE.map((item, index) => (
                <button
                  className={styles.menu_button}
                  key={index}
                  onClick={() => setRowsPerPage(item)}
                >
                  <p>{item}</p>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.controls_right_container}>
        <div
          onClick={() => {
            if (ranking.first_elt_position == 1) return;
            handlePagination("prev");
          }}
          style={{
            cursor:
              ranking?.first_elt_position + ranking?.ranking.length >=
              leaderboardToppers?.[
                timeFrameMap[
                  duration as keyof typeof timeFrameMap
                ] as keyof typeof leaderboardToppers
              ]?.length
                ? "not-allowed"
                : "pointer",
            opacity:
              ranking?.first_elt_position + ranking?.ranking.length >=
              leaderboardToppers?.[
                timeFrameMap[
                  duration as keyof typeof timeFrameMap
                ] as keyof typeof leaderboardToppers
              ]?.length
                ? 0.5
                : 1,
          }}
        >
          <ChevronRightIcon color="#F4FAFF" width="16" />
        </div>
        <div
          onClick={() => {
            if (
              ranking.first_elt_position + ranking.ranking.length >=
              leaderboardToppers[
                timeFrameMap[
                  duration as keyof typeof timeFrameMap
                ] as keyof typeof leaderboardToppers
              ]?.length
            )
              return;
            handlePagination("next");
          }}
          style={{
            cursor:
              ranking?.first_elt_position + ranking?.ranking.length >=
              leaderboardToppers?.[
                timeFrameMap[
                  duration as keyof typeof timeFrameMap
                ] as keyof typeof leaderboardToppers
              ]?.length
                ? "not-allowed"
                : "pointer",
            opacity:
              ranking?.first_elt_position + ranking?.ranking.length >=
              leaderboardToppers?.[
                timeFrameMap[
                  duration as keyof typeof timeFrameMap
                ] as keyof typeof leaderboardToppers
              ]?.length
                ? 0.5
                : 1,
          }}
        >
          <ChevronLeftIcon color="#F4FAFF" width="16" />
        </div>
      </div>
    </div>
  );
};

export default ControlsDashboard;
