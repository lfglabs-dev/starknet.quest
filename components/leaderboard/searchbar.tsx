import React, { useContext, useEffect, useState } from "react";
import SearchIcon from "../../public/icons/searchIcon.svg";
import Image from "next/image";
import styles from "../../styles/leaderboard.module.css";
import CrossIcon from "../../public/icons/cross.svg";
import { StarknetIdJsContext } from "../../context/StarknetIdJsProvider";
import { hexToDecimal } from "../../utils/feltService";

export default function Searchbar(props: {
  handleChange: (_: string) => void;
  value: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  suggestions: string[];
  handleSuggestionClick: (_: string) => void;
}) {
  const { handleChange, value, onKeyDown, suggestions, handleSuggestionClick } =
    props;
  const [showSuggestions, setShowSuggestions] = useState(
    suggestions?.length > 0
  );

  const { starknetIdNavigator } = useContext(StarknetIdJsContext);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.className !== styles.search_bar_container &&
        target.className !== styles.search_bar &&
        target.className !== styles.search_bar_suggestions
      ) {
        setShowSuggestions(false);
      } else {
        setShowSuggestions(true);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleOptionClick = async (option: string) => {
    const addr = await starknetIdNavigator
      ?.getAddressFromStarkName(option)
      .catch((err) => {
        return "";
      });
    if (!addr) return;
    handleSuggestionClick(hexToDecimal(addr));
  };

  return (
    <div className="relative gap-2 z-50">
      <div className={styles.search_bar_container}>
        <Image src={SearchIcon} priority width={16} height={16} />
        <input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className={styles.search_bar}
          placeholder="Search"
          style={{ fontSize: 14 }}
          onKeyDown={onKeyDown}
        />
        {value.length > 0 ? (
          <div
            className="flex cursor-pointer"
            onClick={() => {
              handleChange("");
              handleSuggestionClick("");
            }}
          >
            <Image src={CrossIcon} priority width={20} height={20} />
          </div>
        ) : null}
      </div>
      {showSuggestions && suggestions?.length > 0 ? (
        <div className={styles.search_bar_suggestions}>
          {suggestions.map((suggestion, index) => (
            <div
              className="flex cursor-pointer"
              key={index}
              onClick={() => handleOptionClick(suggestion)}
            >
              <p>{suggestion}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
