import React from "react";
import { observer } from "mobx-react-lite";
import dateStore from "../../store/DateStore";
import styles from "./index.module.css";

const modes: ("month" | "year" | "all")[] = ["month", "year", "all"];
const modeLabels: Record<string, string> = {
  month: "За месяц",
  year: "За год",
  all: "За всё время"
};

const DateSlider: React.FC = observer(() => {
  const handleModeSwitch = () => {
    const currentIndex = modes.indexOf(dateStore.mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dateStore.setMode(nextMode);
  };

  return (
    <div className={styles.container}>
      <button onClick={() => dateStore.next()} className={styles.arrow}>↑</button>

      <div className={styles.centerBlock}>
        <span className={styles.dateText}>{dateStore.formattedDate}</span>
      </div>

      <button onClick={() => dateStore.prev()} className={styles.arrow}>↓</button>

        <button onClick={handleModeSwitch} className={styles.modeButton}>
            {modeLabels[dateStore.mode]}
        </button>
    </div>
  );
});

export default DateSlider;
