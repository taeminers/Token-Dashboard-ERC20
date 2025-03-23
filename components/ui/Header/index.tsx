"use client";
import Image from "next/image";
import React from "react";
import "./header.css";
import { useRouter, useSearchParams } from "next/navigation";
import { HeaderProps } from "./types";
const Header = ({ text: headerText, exit_icon }: HeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const exitPageHandler = () => {
    router.back();
  };
  return (
    <header
      className={
        exit_icon ? "header-container-icons" : "header-container-no-icons"
      }
    >
      {exit_icon && (
        <Image
          src="/icon/Exit-Page.png"
          className="exit-icon"
          width={25}
          height={25}
          alt="exit-page-icon"
          onClick={exitPageHandler}
        />
      )}
      <h1 className="header-text">
        {token ? token + " " + headerText : headerText}
      </h1>
      {exit_icon && <div className="header-empty-container-right" />}
    </header>
  );
};

export default Header;
