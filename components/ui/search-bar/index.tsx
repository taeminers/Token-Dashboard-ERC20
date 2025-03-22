"use client";
import { useState } from "react";
import "./search-bar.css";
import Image from "next/image";
export const SearchBar = () => {
  const [search, setSearch] = useState("");
  const handleClear = () => setSearch("");
  return (
    <section className="search-container">
      <Image
        src="/icon/Search.svg"
        width={18}
        height={18}
        className="search-icon"
        alt="Search Icon"
      />
      <input
        className="search-bar placeholder-text"
        placeholder="토큰 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Image
        src="/icon/Close.svg"
        width={18}
        height={18}
        className="clear-icon"
        alt="Close Icon"
        onClick={handleClear}
      />
    </section>
  );
};
