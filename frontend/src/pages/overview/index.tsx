import React, { useEffect, useState } from 'react';
import ActionsService from '../../services/ActionsService';
import styles from './index.module.css';
import { DonutChart } from '../../components/donuts';
import { TransactionForm } from '../../components/transactionForm';
import { CategoryResponse } from '../../models/response/CategoryResponse';
import CategoriesService from '../../services/CategoriesService';
import { ActionResponse } from '../../models/response/ActionResponse';


export const OverviewPage: React.FC = () => {
  const [actions, setActions] = useState<ActionResponse[]>([]);
  const [loadingActions, setLoadingActions] = useState(true);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  // Группируем данные по категориям и типу (доход/расход)
  const aggregateByCategory = (type: string) => {
    const filtered = actions.filter((a) => a.type === type);
    const map = new Map<string, { value: number; color: string }>();

    filtered.forEach(({ category_name, sum, category_color }) => {
      const name = category_name || 'Без категории';
      const color = category_color || '#8884d8'; // дефолтный цвет

      if (map.has(name)) {
        map.get(name)!.value += sum;
      } else {
        map.set(name, { value: sum, color });
      }
    });

    return Array.from(map.entries()).map(([name, { value, color }]) => ({
      name,
      value,
      color,
    }));
  };

  if (loadingActions || loadingCategories) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const expensesData = aggregateByCategory('Расход');
  const incomeData = aggregateByCategory('Доход');

  return (
    <div className={styles.overviewContainer}>
      <DonutChart data={expensesData} title="Расходы" />
      <DonutChart data={incomeData} title="Доходы" />
      <TransactionForm
        categories={categories}
        onSubmit={(data) => {
            console.log('Transaction:', data);
        }}
        />
    </div>
  );
};
