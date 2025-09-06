import React, { useEffect, useState } from 'react';
import ActionsService from '../../services/ActionsService';
import styles from './index.module.css';
import { DonutChart } from '../../components/donuts';
import { TransactionForm } from '../../components/transactionForm';
import { CategoryResponse } from '../../models/response/CategoryResponse';
import CategoriesService from '../../services/CategoriesService';
import { ActionResponse } from '../../models/response/ActionResponse';
import { observer } from "mobx-react-lite";
import dateStore, { DateMode } from '../../store/DateStore'
import { CategoriesPalette } from '../../components/categoriesPalette';
import { CreateCategoryForm } from '../../components/createCategoryForm';


export const OverviewPage: React.FC = observer(() => {
  const { selectedDate, mode } = dateStore;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Группируем данные по категориям и типу (доход/расход)
  const aggregateByCategory = (type: string) => {
    return categories.filter((c) => {return c.type == type})
  };

  if (loadingCategories) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const expensesData = aggregateByCategory('Расход');
  const incomeData = aggregateByCategory('Доход');

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.donuts}>
        <DonutChart data={expensesData} title="Расходы" />
        <DonutChart data={incomeData} title="Доходы" />        
      </div>
      <div className={styles.palette}>
        <h3 className={styles.paletteTitle}>Расходы</h3>
        <CategoriesPalette categories={categories.filter((c) => {return c.type == 'Расход'})} />
        <h3 className={styles.paletteTitle}>Доходы</h3>
        <CategoriesPalette categories={categories.filter((c) => {return c.type == 'Доход'})}/>
        <div style={{marginTop: '2vh'}}>
          <CreateCategoryForm onCreate={getData}/>
        </div>  
      </div>
    </div>
  );
});
