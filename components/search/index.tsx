"use client";

import React, { FC, FormEvent } from "react";
import SearchIcon from "@/assets/svgs/search-icon.svg";
import clsx from "clsx";

import { ISearchProps } from "./types";

const Search: FC<ISearchProps> = (props) => {
  const {
    placeholder = "Enter a search term",
    onChange,
    value = "",
    className,
    name,
    id = "rse-search",
  } = props;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const classes = clsx(
    `flex justify-normal items-center border border-N40 rounded py-2 px-3 focus-within:border-B100 focus-within:border-2`,
    className,
  );

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <input
        type="search"
        name={name}
        id={id}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="grow focus:outline-none"
      />
      <button type="submit">
        <SearchIcon />
      </button>
    </form>
  );
};

export { Search };
