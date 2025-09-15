import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.css';
import { CategoryResponse } from '../../models/response/CategoryResponse';
import { ActionResponse } from '../../models/response/ActionResponse';
import { CategoriesPalette } from '../categoriesPalette';
import { ButtonDelete, ButtonSubmit } from '../buttons';

type TransactionType = 'Доход' | 'Расход';

type Props = {
  categories: CategoryResponse[];
  onSubmit: (data: {
    category_id: number;
    sum: number;
    message: string;
    date: Date;
    type: TransactionType;
  }) => Promise<void>;
  onDelete: (action_id: number) => void;
  editingOperation?: ActionResponse | null;
  onCancelEdit?: () => void;
};

export const TransactionForm: React.FC<Props> = ({
  categories,
  onSubmit,
  onDelete,
  editingOperation,
  onCancelEdit
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sum, setSum] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<TransactionType>('Расход');
  const [filteredCategories, setfilteredCategories] = useState<CategoryResponse[]>(categories.filter((c) => {return c.type == type}));

  useEffect(() => {   
    if (editingOperation) {     
      setSelectedCategoryId(editingOperation.category_id);
      setMessage(editingOperation.message);
      setSum(editingOperation.sum);
      setDate(new Date(editingOperation.date));
      setType(editingOperation.category_type as TransactionType);      
    } else {
      setSelectedCategoryId(null);
      setMessage('');
      setSum(0);
      setDate(new Date());
      setType('Расход');
    }
  }, [editingOperation]);

  useEffect(() => {
    if (
      selectedCategoryId !== null &&
      !filteredCategories.some((cat) => cat.id === selectedCategoryId)
    ) {
      setSelectedCategoryId(null);
    }
    setfilteredCategories(categories.filter(
      (category) => category.type === type
    ))  
  }, [type, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    onSubmit({
      category_id: selectedCategoryId,
      sum,
      message,
      date,
      type,
    }).then(() => {
      setSelectedCategoryId(null);
      setMessage('');
      setSum(0);
      setDate(new Date());
      setType('Расход');
    })
       
  };

  return (
    <form onSubmit={handleSubmit} className={styles.transactionForm}>
      {editingOperation && (
        <div className={styles.editingBanner}>
          <span>Редактирование операции</span>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancelEdit}
            title="Отменить редактирование"
          >
            ✕
          </button>
        </div>
      )}

      <div className={styles.categoriesPalette}>
        <CategoriesPalette categories={filteredCategories} selectedCategoryId={selectedCategoryId} setSelectedCategoryId={setSelectedCategoryId} />
      </div>
      

      <div className={styles.fields}>
        <div className={styles.fieldGroup}>
          <input
            type="text"
            placeholder="Описание"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className={styles.fieldGroup}>
          <input
            type="number"
            placeholder="Сумма"
            value={sum === 0 ? '' : sum}
            onChange={(e) => setSum(parseFloat(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.datePicker}>
            <DatePicker
              selected={date}
              onChange={(date) => date && setDate(date)}
              dateFormat="dd.MM.yyyy"
              placeholderText="Дата"
            />            
          </div>

        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.toggleSwitchWrapper}>
            <div className={styles.toggleSwitch}>
              <button
                type="button"
                className={`${styles.toggleOption} ${type === 'Расход' ? styles.active : ''}`}
                onClick={() => setType('Расход')}
              >
                Расход
              </button>
              <button
                type="button"
                className={`${styles.toggleOption} ${type === 'Доход' ? styles.active : ''}`}
                onClick={() => setType('Доход')}
              >
                Доход
              </button>
              <div
                className={styles.toggleIndicator}
                style={{ left: type === 'Расход' ? '0%' : '50%' }}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.bottomButtonsContainer}>
          {!editingOperation && (
            <ButtonSubmit htmlType="submit" disabled={!selectedCategoryId && !editingOperation}>Создать</ButtonSubmit>
          )}

          {editingOperation && (
            <ButtonSubmit htmlType="submit" >Сохранить изменения</ButtonSubmit>
          )}
          {editingOperation && (
            <ButtonDelete onClick={() => onDelete(editingOperation.id)} variant='filled'>Удалить</ButtonDelete>
          )}
        </div>

      </div>
    </form>
  );
};
