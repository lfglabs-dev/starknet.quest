import React, { FunctionComponent } from "react";
import SearchIcon from "../../public/icons/searchIcon.svg";
import Image from "next/image";

type SearchbarProps = {
  handleSearch: (_: string) => void;
  value: string;
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
};

const Searchbar: FunctionComponent<SearchbarProps> = ({
  handleSearch,
  value,
  onKeyDown,
}) => {
  return (
    <div className="flex flex-row p-2 bg-background w-full rounded-lg">
      <Image src={SearchIcon} priority width={16} height={16} />
      <input
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        className="bg-transparent outline-none ml-2 w-full"
        placeholder="Search"
        style={{ fontSize: 14 }}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};

export default Searchbar;
