import React, { MouseEventHandler, useEffect, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.css';
import { CategoryResponse } from '../../models/response/CategoryResponse';

type Props = {
  categories: CategoryResponse[];
  selectedCategoryId?: number | null;
  setSelectedCategoryId?: React.Dispatch<React.SetStateAction<number | null>>;
};

export const CategoriesPalette: React.FC<Props> = ({
  categories,
  selectedCategoryId,
  setSelectedCategoryId,
}) => {

  function hexToRGBA(hex: string, alpha = 0.3) {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  return (
    <div className={styles.palette}>
        {categories.map((category) => {
          const categorySum = category.sum || 0;
          return (
            <div
              key={category.id} 
              className={setSelectedCategoryId ?`${styles.colorItem} ${selectedCategoryId === category.id ? styles.selected : ''}` : `${styles.colorItem}`}
              style={category.sum == 0 ? { 
                backgroundColor: category.color,
                opacity: 0.3
              }: {backgroundColor: category.color}}
              onClick={setSelectedCategoryId ? () => setSelectedCategoryId(category.id) : () => {}}
              title={category.name}    
            >
              {(selectedCategoryId === category.id && setSelectedCategoryId) && <span className={styles.checkmark}>✓</span>}     
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>{category.name}</div>
                <div className={styles.categoryAmount}>
                  {categorySum.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </div>
              </div>  
            </div>   
            );
        })}
    </div> 
  )
};
