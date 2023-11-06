import React from "react";
import SearchIcon from "../../public/icons/searchIcon.svg";
import Image from "next/image";

export default function Searchbar({ handleSearch, value, onKeyDown }) {
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
}
