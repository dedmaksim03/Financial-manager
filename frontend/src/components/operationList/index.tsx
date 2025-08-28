import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import ActionsService from "../../services/ActionsService";
import { ActionResponse } from "../../models/response/ActionResponse";

interface Props {
    sortedDates: string[],
    grouped: Record<string, ActionResponse[]>
    handleClick: (operation: ActionResponse) => void
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const OperationList: React.FC<Props> = ({sortedDates, grouped, handleClick} ) => {

    return (
    <div className={styles.container}>
        {sortedDates.map((date) => (
        <div key={date} className={styles.dateGroup}>
            <h3 className={styles.dateHeader}>{formatDate(date)}</h3>
            {grouped[date].map((op) => (
            <div
                key={op.id}
                className={styles.operationRow}
                onClick={() => handleClick(op)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    handleClick(op);
                }
                }}
            >
                <div
                    className={styles.categoryIcon}
                    style={{ backgroundColor: op.category_color }}
                    aria-label={op.category_name}
                    title={op.category_name}
                />
                <div style={{ flexGrow: 1 }}>
                <div className={styles.categoryName}>{op.category_name}</div>
                <div className={styles.message}>{op.message}</div>
                </div>
                <div
                className={`${styles.amount} ${
                    op.category_type == "Расход" ? styles.negative : styles.positive
                }`}
                >
                {op.category_type == 'Расход' ? "-" : "+"}
                {Math.abs(op.sum).toLocaleString("ru-RU")} ₽
                </div>
            </div>
            ))}
        </div>
        ))}
    </div>
    );
};

export default OperationList;
