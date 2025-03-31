"use client";

import React, { FC, FormEvent } from "react";

import clsx from "clsx";

import { ISearchProps } from "./types";
import { Search } from "lucide-react";

const SearchInput: FC<ISearchProps> = (props) => {
  const {
    placeholder = "Enter a search term",
    onChange,
    value = "",
    className,
    name,
    id = "rse-search",
    ariaLabel,
  } = props;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const classes = clsx(
    `flex justify-normal font-clashDisplay items-center border border-N40 rounded py-2 px-3 focus-within:border-BR100 focus-within:border-2`,
    className
  );

  return (
    <form className={classes} onSubmit={handleSubmit}>
      <div className="relative w-full">
        <Search
          className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="search"
          name={name}
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          aria-label={ariaLabel}
          className="grow w-full text-ellipsis text-p-s md:text-p-m pl-6 focus:outline-none"
        />
      </div>
    </form>
  );
};

export { SearchInput };
