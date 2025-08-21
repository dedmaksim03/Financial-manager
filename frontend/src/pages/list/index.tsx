import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import ActionsService from "../../services/ActionsService";
import { ActionResponse } from "../../models/response/ActionResponse";

function groupByDate(ops: ActionResponse[]) {
  return ops.reduce<Record<string, ActionResponse[]>>((acc, op) => {
    if (!acc[op.date.toString()]) acc[op.date.toString()] = [];
    acc[op.date.toString()].push(op);
    return acc;
  }, {});
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const OperationList: React.FC = () => {

    const [actions, setActions] = useState<ActionResponse[]>([]);
    const [loadingActions, setLoadingActions] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        ActionsService.getActions()
        .then((data) => {
            console.log(data.data)
            setActions(data.data)
            setLoadingActions(false)
        })
        .catch(() => {
            console.log("Ошибка загрузки данных")
            setError("Ошибка загрузки данных")
            setLoadingActions(false)
        })
    }, [])

    const grouped = groupByDate(actions);
    const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

    const handleClick = (operation: ActionResponse) => {
    console.log("Clicked operation:", operation);
    };

    if (loadingActions) return <div>Загрузка...</div>;
    if (error) return <div>{error}</div>;

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
                    op.type == "Расход" ? styles.negative : styles.positive
                }`}
                >
                {op.sum < 0 ? "-" : "+"}
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
