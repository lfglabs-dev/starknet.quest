import React, { FunctionComponent, useMemo, useState } from "react";
import { PAGE_SIZE, timeFrameMap } from "@utils/constants";
import styles from "@styles/leaderboard.module.css";
import ChevronLeftIcon from "@components/UI/iconsComponents/icons/chevronLeftIcon";
import ChevronRightIcon from "@components/UI/iconsComponents/icons/ChevronRightIcon";
import { CDNImage } from "@components/cdn/image";

// this will contain the pagination arrows and page size limit controls
const ControlsDashboard: FunctionComponent<ControlsDashboardProps> = ({
  ranking,
  handlePagination,
  rowsPerPage,
  setRowsPerPage,
  leaderboardToppers,
  duration,
  setCustomResult,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const checkIfLastPage = useMemo(() => {
    /*
    check if the current page is the last page

    first_elt_position is the index of the first element in the current page
    and ranking.length is the number of elements in the current page

    so if the sum of these two is greater than the number of players in the
    leaderboard toppers api response, then we are on the last page
    */

    if (
      ranking?.first_elt_position + ranking?.ranking?.length >=
      leaderboardToppers?.[
        timeFrameMap[
          duration as keyof typeof timeFrameMap
        ] as keyof typeof leaderboardToppers
      ]?.length
    )
      return true;
    return false;
  }, [leaderboardToppers, ranking, duration]);

  const checkIfFirstPage = useMemo(() => {
    /*
    check if the current page is the first page

    first_elt_position is the index of the first element in the current page
    so if this is less than or equal to 1, then we are on the first page
    */
    if (ranking?.first_elt_position <= 1) return true;
    return false;
  }, [ranking]);

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
            <CDNImage
              src={"/icons/dropdownArrow.svg"}
              priority
              alt="Arrow icon"
            />
          </div>
          {showMenu ? (
            <div className={styles.pages_menu}>
              {PAGE_SIZE.map((item, index) => (
                <button
                  className={styles.menu_button}
                  key={index}
                  onClick={() => {
                    setCustomResult(true);
                    setRowsPerPage(item);
                  }}
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
            if (checkIfFirstPage) return;
            handlePagination("prev");
          }}
          style={{
            cursor: checkIfFirstPage ? "not-allowed" : "pointer",
            opacity: checkIfFirstPage ? 0.5 : 1,
          }}
        >
          <ChevronLeftIcon color="#F4FAFF" width="16" />
        </div>
        <div
          onClick={() => {
            if (checkIfLastPage) return;
            handlePagination("next");
          }}
          style={{
            cursor: checkIfLastPage ? "not-allowed" : "pointer",
            opacity: checkIfLastPage ? 0.5 : 1,
          }}
        >
          <ChevronRightIcon color="#F4FAFF" width="16" />
        </div>
      </div>
    </div>
  );
};

export default ControlsDashboard;
