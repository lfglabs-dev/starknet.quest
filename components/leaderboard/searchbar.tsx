import React, {
  useContext,
  useEffect,
  useState,
  FunctionComponent,
} from "react";
import Image from "next/image";
import styles from "../../styles/leaderboard.module.css";
import { StarknetIdJsContext } from "../../context/StarknetIdJsProvider";
import { hexToDecimal } from "../../utils/feltService";

type SearchbarProps = {
  handleChange: (_: string) => void;
  value: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  suggestions: string[];
  handleSuggestionClick: (_: string) => void;
};

const Searchbar: FunctionComponent<SearchbarProps> = ({
  handleChange,
  value,
  onKeyDown,
  suggestions,
  handleSuggestionClick,
}) => {
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
      .catch(() => {
        return "";
      });
    if (!addr) return;
    handleChange(option);
    handleSuggestionClick(hexToDecimal(addr));
  };

  return (
    <div className="relative gap-2 z-50">
      <div className={styles.search_bar_container}>
        <Image
          src={"/icons/searchIcon.svg"}
          priority
          width={16}
          height={16}
          alt="search icon"
        />
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
            className="flex modified-cursor-pointer"
            onClick={() => {
              handleChange("");
              handleSuggestionClick("");
            }}
          >
            <Image
              src={"/icons/cross.svg"}
              priority
              width={20}
              height={20}
              alt="cross icon"
            />
          </div>
        ) : null}
      </div>
      {showSuggestions && suggestions?.length > 0 ? (
        <div className={styles.search_bar_suggestions}>
          {suggestions.map((suggestion, index) => (
            <div
              className="flex modified-cursor-pointer"
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
};

export default Searchbar;
