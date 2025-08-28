import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import ActionsService from "../../services/ActionsService";
import { ActionResponse } from "../../models/response/ActionResponse";
import OperationList from "../../components/operationList";

import { CategoryResponse } from "../../models/response/CategoryResponse";
import { TransactionForm } from "../../components/transactionForm";
import CategoriesService from "../../services/CategoriesService";
import { observer } from "mobx-react-lite";
import dateStore from "../../store/DateStore";

function groupByDate(ops: ActionResponse[]) {
  return ops.reduce<Record<string, ActionResponse[]>>((acc, op) => {
    const dateKey = new Date(op.date).toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(op);
    return acc;
  }, {});
}

const OperationListPage: React.FC = observer(() => {
  const { selectedDate, mode } = dateStore;
  
  const [actions, setActions] = useState<ActionResponse[]>([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);  
  const [error, setError] = useState<string | null>(null);
  const [editingOperation, setEditingOperation] = useState<ActionResponse | null>(null);

    const getData = () => {
      let dateFrom: string
      let dateTo: string

      switch (mode){
        case ("all"):
          dateFrom = "2000-01-01"
          dateTo = new Date().toISOString()
          break
        case ("year"):
          dateFrom = new Date(selectedDate.get('year'), 0, 1).toISOString()
          dateTo = new Date(selectedDate.get('year')+1, 0, 0).toISOString()
          break        
        case ("month"):
          dateFrom = new Date(selectedDate.get('year'), selectedDate.get('month'), 1).toISOString()
          dateTo = new Date(selectedDate.get('year'), selectedDate.get('month')+1, 0).toISOString()
          break        
      }

      ActionsService.getActions(dateFrom, dateTo)
      .then((data) => {
          setActions(data.data);
          setLoadingActions(false);
      })
      .catch(() => {
          setError('Ошибка загрузки данных');
          setLoadingActions(false);
      });
      CategoriesService.getCategories(dateFrom, dateTo)
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
  }, [selectedDate, mode]);

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
});

export default OperationListPage;
