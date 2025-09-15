import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import { DonutChart } from '../../components/donuts';
import { CategoryResponse } from '../../models/response/CategoryResponse';
import CategoriesService from '../../services/CategoriesService';
import { observer } from "mobx-react-lite";
import dateStore, { DateMode } from '../../store/DateStore'
import { CategoriesPalette } from '../../components/categoriesPalette';
import { ButtonDelete, ButtonSubmit } from '../../components/buttons';
import CategoryFormModal, { CategoryFormData } from '../../components/categoryForm';


export const OverviewPage: React.FC = observer(() => {
  const { selectedDate, mode } = dateStore;

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number|null>(null)
  const refPalleteUp = useRef<HTMLDivElement>(null);
  const refPalleteDown = useRef<HTMLDivElement>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<CategoryFormData | undefined>(undefined);  


  const handleSave = (data: CategoryFormData) => {
    CategoriesService.createCategory(data)
      .then(() => getData())
      .then(() => setModalOpen(false))
  };  

  const handleDelete = () => {
    const confirmed = window.confirm("Данное действие приведет к удалению всех зависимых объектов");
    if (confirmed && selectedCategoryId) {
      CategoriesService.deleteCategory(selectedCategoryId)
        .then(() => getData())
    }
  };

  // const handleEdit = (data: CategoryFormData) => {
  //   CategoriesService.createCategory(data)
  //     .then(() => getData())
  //     .then(() => setModalOpen(false))
  // };    

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (refPalleteUp.current && refPalleteDown.current &&
          !refPalleteUp.current.contains(event.target as Node) &&
          !refPalleteDown.current.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest('button')

        ) {
        setSelectedCategoryId(null);
      }
    }
    if (selectedCategoryId != null) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedCategoryId]);  

  // Группируем данные по категориям и типу (доход/расход)
  const aggregateByCategory = (type: string) => {
    return categories.filter((c) => {return c.type == type})
  };

  if (loadingCategories) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  const expensesData = aggregateByCategory('Расход');
  const incomeData = aggregateByCategory('Доход');
  const resultSum = incomeData.reduce((acc, val) => acc + val.sum, 0) - expensesData.reduce((acc, val) => acc + val.sum, 0)

  return (
    <div className={styles.overviewContainer}>
      <div className={styles.leftPane}>
        <div className={styles.leftUpPane}>
          <DonutChart data={expensesData} title="Расходы" />
          <DonutChart data={incomeData} title="Доходы" />  
        </div>
        <div className={styles.leftDownPane}>
          <h3 className={styles.leftDownPaneHeader}>Итог</h3>
          <h3 
            className={styles.leftDownPaneText}
            style={resultSum < 0 ? {color: '#ff0000'} : {color: '#008000'}}
          >
            {
             `${resultSum < 0 ? `` : `+`}${resultSum.toLocaleString()} ₽ `
            }
          </h3 >
        </div>        
      
      </div>
      <div className={styles.palette}>
        <div className={styles.paletteUpContainer}>
          <h3 className={styles.paletteTitle}>Расходы</h3>
          <div className={styles.categoriesPalette} ref={refPalleteUp}>
            <CategoriesPalette 
              categories={categories.filter((c) => {return c.type == 'Расход'})} 
              selectedCategoryId={selectedCategoryId} 
              setSelectedCategoryId={setSelectedCategoryId} 
              />
          </div>
          <h3 className={styles.paletteTitle}>Доходы</h3>
          <div className={styles.categoriesPalette} ref={refPalleteDown}>
            <CategoriesPalette 
              categories={categories.filter((c) => {return c.type == 'Доход'})}
                selectedCategoryId={selectedCategoryId} 
                setSelectedCategoryId={setSelectedCategoryId} 
              />
          </div>                  
        </div>

        <div className={styles.paletteDownContainer}>
          {selectedCategoryId != null ?
          <>
            <div className={styles.downButton}>
              <ButtonSubmit variant='dashed' onClick={() => {
                setEditData({
                  name: 'Продукты',
                  color: '#ff0000',
                  type: 'Расход',
                });
                setModalOpen(true);
              }} style={{ marginLeft: 16 }}>
                Редактировать
              </ButtonSubmit>   
            </div>    
            <div className={styles.downButton}>    
              <ButtonDelete onClick={handleDelete}>
                Удалить
              </ButtonDelete>
            </div>          
          </> 
          :
          <div className={styles.downButton}>
            <ButtonSubmit onClick={() => { setEditData(undefined); setModalOpen(true); }}>
                Добавить категорию
            </ButtonSubmit>  
          </div> 
          }
        </div>

        <CategoryFormModal 
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSave}
          initialData={editData}
        />  
      
      </div>
    </div>
  );
});
