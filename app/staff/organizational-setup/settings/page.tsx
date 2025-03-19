"use client";

import React, { useState } from "react";
import { Jumbotron, ToggleElement, Typography } from "@/components";

const SettingsPage = () => {
  return (
    <div>
      <Jumbotron headerText="Employee Email Alerts ">
        <div className="flex flex-col gap-8 p-5">
          <SettingsActionToggle
            heading={"Birthday Alerts"}
            subHeading={`Enable birthday emails to send greetings to employees on their special
          day.`}
            id={"birthday-alert-toggle"}
          />
          <SettingsActionToggle
            heading={"Work Anniversary Alerts"}
            subHeading={
              "Recognize Milestones! Enable work anniversary emails to celebrate employees' time with the company."
            }
            id={"work-anniversary-alert-toggle"}
          />
        </div>
      </Jumbotron>
    </div>
  );
};

export default SettingsPage;

interface ISettingsActionToggleProps {
  heading: string;
  subHeading: string;
  id: string;
}

const SettingsActionToggle = ({
  heading,
  subHeading,
  id,
}: ISettingsActionToggleProps) => {
  const [toggle, setToggle] = useState(false);
  return (
    <div className="flex w-full items-center">
      <div className="flex w-[90%] max-w-[502px] flex-col gap-1">
        <Typography variant="h-s" color={"text-default"}>
          {heading}
        </Typography>
        <Typography variant="p-m" color={"N300"} className="max-w-[401px]">
          {subHeading}
        </Typography>
      </div>
      <span>
        <ToggleElement
          id={id}
          checked={toggle}
          onChange={() => setToggle(!toggle)}
        />
      </span>
    </div>
  );
};
