import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import ActionsService from "../../services/ActionsService";
import { ActionResponse } from "../../models/response/ActionResponse";
import OperationList from "../../components/operationList";

import { CategoryResponse } from "../../models/response/CategoryResponse";
import { TransactionForm } from "../../components/transactionForm";
import CategoriesService from "../../services/CategoriesService";

// Мокаем категории (можно заменить на реальные данные)
const mockCategories: CategoryResponse[] = [
  { id: 1, name: "Еда", color: "#FF6347", sum: -500 },
  { id: 2, name: "Зарплата", color: "#4CAF50", sum: 50000 },
  { id: 3, name: "Транспорт", color: "#1E90FF", sum: -1200 },
];

function groupByDate(ops: ActionResponse[]) {
  return ops.reduce<Record<string, ActionResponse[]>>((acc, op) => {
    const dateKey = new Date(op.date).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(op);
    return acc;
  }, {});
}

const OperationListPage: React.FC = () => {
  const [actions, setActions] = useState<ActionResponse[]>([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);  
  const [error, setError] = useState<string | null>(null);
  const [editingOperation, setEditingOperation] = useState<ActionResponse | null>(null);

    const getData = () => {
        ActionsService.getActions()
        .then((data) => {
            setActions(data.data);
            setLoadingActions(false);
        })
        .catch(() => {
            setError('Ошибка загрузки данных');
            setLoadingActions(false);
        });
        CategoriesService.getCategories("2025-07-05", "2025-12-20")  // год-месяц-день
            .then((data) => {
                setCategories(data.data)
                setLoadingCategories(false)
            })
            .catch(() => {
                setError('Ошибка загрузки данных');
                setLoadingCategories(false);
            })
    }    

  useEffect(() => {
    getData()
  }, []);

  const grouped = groupByDate(actions);
  const sortedDates = Object.keys(grouped).sort((a, b) => (a < b ? 1 : -1));

  const handleClick = (operation: ActionResponse) => {
    console.log("Selected for editing:", operation);
    setEditingOperation(operation);
  };

  const handleFormSubmit = (data: {
    category_id: number;
    sum: number;
    message: string;
    date: Date;
    type: "Доход" | "Расход";
  }) => {
    if (editingOperation) {
      console.log("Измененная операция:", {
        ...editingOperation,
        ...data,
      });
      setEditingOperation(null);
    } else {
      ActionsService.createAction(
            data.type,
            data.message,
            data.sum,
            data.date.toISOString(),
            data.category_id
        )
        .then(() => {
            getData()              
        })
        .catch(() => console.log("Ошибка при создании Action"))
        console.log('Transaction:', data);
    }
  };

  const handleCancelEdit = () => {
    setEditingOperation(null);
  };

  if (loadingActions) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

    return (
    <div className={styles.pageWrapper}>
        <div className={styles.leftPane}>
        <OperationList
            sortedDates={sortedDates}
            grouped={grouped}
            handleClick={handleClick}
        />
        </div>
        <div className={styles.rightPane}>
        <TransactionForm
            categories={categories}
            onSubmit={ handleFormSubmit}
            editingOperation={editingOperation}
            onCancelEdit={handleCancelEdit}
        />
        </div>
    </div>
);
};

export default OperationListPage;
