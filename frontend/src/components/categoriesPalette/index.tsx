import React, { MouseEventHandler, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
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

  if (!selectedCategoryId || !setSelectedCategoryId)
    return (
      <div className={styles.palette}>
        {categories.map((category) => {
          const categorySum = category.sum || 0;
          return (
            <div
              key={category.id}
              className={`${styles.colorItem}`}
              style={{ backgroundColor: category.color }}
              title={category.name}
            >
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>{category.name}</div>
                <div className={styles.categorysum}>
                  {categorySum.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>  
  )

  return (
      <div className={styles.palette}>
        {categories.map((category) => {
          const categorySum = category.sum || 0;
          return (
            <div
              key={category.id}
              className={`${styles.colorItem} ${selectedCategoryId === category.id ? styles.selected : ''}`}
              style={{ backgroundColor: category.color }}
              onClick={() => setSelectedCategoryId(category.id)}
              title={category.name}
            >
              {selectedCategoryId === category.id && <span className={styles.checkmark}>✓</span>}
              <div className={styles.categoryInfo}>
                <div className={styles.categoryName}>{category.name}</div>
                <div className={styles.categorysum}>
                  {categorySum.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
  );
};
