"use client";
import { useState } from "react";
import "./search-bar.css";
import Image from "next/image";
import { useSearch } from "@/context/SearchContext/SearchContext";

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useSearch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const handleClear = () => {
    setSearchTerm("");
  };

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
        value={searchTerm}
        onChange={handleChange}
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
