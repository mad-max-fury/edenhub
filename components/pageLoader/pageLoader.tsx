import styles from "./style.module.css";

const PageLoader = ({ isOuterPage = false }: { isOuterPage?: boolean }) => {
  return !isOuterPage ? (
    <div className="[&>div]:!h-[60vh] [&>div]:!w-full">
      <div className={styles.wrapper}>
        <div className={styles.grid}>
          <div className={`${styles.ball} ${styles.one}`}></div>
          <div className={`${styles.ball} ${styles.two}`}></div>
          <div className={`${styles.ball} ${styles.three}`}></div>
          <div className={`${styles.ball} ${styles.four}`}></div>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <div className={`${styles.ball} ${styles.one}`}></div>
        <div className={`${styles.ball} ${styles.two}`}></div>
        <div className={`${styles.ball} ${styles.three}`}></div>
        <div className={`${styles.ball} ${styles.four}`}></div>
      </div>
    </div>
  );
};

export { PageLoader };
