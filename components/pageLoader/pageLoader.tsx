import { useEffect, useRef } from "react";
import styles from "./style.module.css";

const PageLoader = ({ isOuterPage = false }: { isOuterPage?: boolean }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll("path");
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });
  }, []);

  const containerClass = isOuterPage
    ? styles.wrapper
    : "flex justify-center items-center w-full h-[60vh]";

  return (
    <div className={containerClass}>
      <div className={styles.logoContainer}>
        <svg
          ref={svgRef}
          width="100"
          height="102"
          viewBox="0 0 450 459"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.logo}
        >
          <path
            d="M155.273 11.5785C177.948 4.06618 202.193 -0.000244141 227.387 -0.000244141C252.58 -0.000244141 276.822 4.06551 299.495 11.5766V84.5387L242.504 141.53V24.5838C232.305 23.3932 222.495 23.3885 212.264 24.5536V237.018L300.759 148.524L300.759 198.511L212.264 287.006V432.062C222.432 433.16 232.242 433.073 242.504 431.817V329.813L299.495 272.822V446.677C276.822 454.188 252.58 458.254 227.387 458.254C202.193 458.254 177.948 454.187 155.273 446.675V11.5785Z"
            fill="none"
            stroke="var(--color-BR300)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.logoPath}
          />
          <path
            d="M125.033 434.179V277.445L124.091 276.503L124.764 276.268L8.77699 160.283C4.75084 173.08 1.81736 186.361 0.0859375 200.018L68.042 267.974V393.778C84.781 409.98 103.983 423.653 125.033 434.179ZM68.042 64.4743V172.029L125.033 229.02V24.0724C103.983 34.5993 84.781 48.272 68.042 64.4743Z"
            fill="none"
            stroke="var(--color-BR300)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.logoPath}
          />
          <path
            d="M329.738 24.0739V294.986L386.729 237.995V237.44L449.905 174.264C446.832 161.756 442.731 149.651 437.698 138.045L386.729 189.014V64.4764C369.99 48.2739 350.788 34.601 329.738 24.0739ZM386.729 393.777V286.421L329.738 343.412V434.179C350.788 423.652 369.99 409.979 386.729 393.777Z"
            fill="none"
            stroke="var(--color-BR300)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={styles.logoPath}
          />
        </svg>
      </div>
    </div>
  );
};

export { PageLoader };
