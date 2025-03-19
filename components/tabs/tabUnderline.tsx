"use client";

import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/utils/helpers";

import { Typography } from "../typography";

type Tab = {
  label: string;
  query: string;
  count?: number;
  content?: ReactNode;
};

type TabUnderlineProps = {
  tabs: Tab[];
  onChange: (query: string) => void;
  activeTab: string;
  showShadow?: boolean;
  noMargin?: boolean;
  className?: string;
};

const TabUnderline = ({
  tabs,
  onChange,
  activeTab,
  showShadow = true,
  noMargin,
  className,
}: TabUnderlineProps) => {
  const [sliderStyle, setSliderStyle] = React.useState<CSSProperties>({});
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) => tab.query === activeTab);
    const activeTabRef = tabsRef.current[activeIndex];
    if (activeTabRef) {
      const { offsetLeft, clientWidth } = activeTabRef;
      setSliderStyle({
        left: offsetLeft,
        width: clientWidth,
      });
    }
  }, [activeTab, tabs]);

  const handleTabClick = (query: string) => {
    onChange(query);
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex overflow-x-auto",
          "gap-6 pl-2",
          showShadow ? "tab-box-shadow" : "",
        )}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.query}
            ref={(el) => {
              tabsRef.current[index] = el;
            }}
            onClick={() => handleTabClick(tab.query)}
            className={cn(
              "cursor-pointer whitespace-nowrap px-2 py-2 text-center hover:text-B300",
              activeTab === tab.query ? "font-medium text-B400" : "text-N900",

              className,
            )}
          >
            <Typography
              fontWeight={"regular"}
              variant={"p-m"}
              className="text-[inherit]"
            >
              {tab.label} {tab.count && ` (${tab.count})`}
            </Typography>
          </button>
        ))}
        <div
          className="absolute bottom-0 h-1 bg-B400 transition-all duration-300"
          style={{ ...sliderStyle }}
        />
      </div>
      {tabs.find((tab) => tab.query === activeTab)?.content && (
        <div className={noMargin ? "mt-0" : "mt-6"}>
          {tabs.find((tab) => tab.query === activeTab)?.content}
        </div>
      )}
    </div>
  );
};

export { TabUnderline };
