import React from "react";

export const InfiniteProgressBar = () => {
  return (
    <div
      className={`progress infinite-progress-bar absolute z-[2] flex h-[2px] w-full overflow-hidden bg-transparent`}
    >
      <div role="progressbar" className={`w-full animate-move bg-B300`} />
    </div>
  );
};
