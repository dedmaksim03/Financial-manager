import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.css';
import { CategoryResponse } from '../../models/response/CategoryResponse';
import { ActionResponse } from '../../models/response/ActionResponse';

type TransactionType = 'Доход' | 'Расход';

type Props = {
  categories: CategoryResponse[];
  onSubmit: (data: {
    category_id: number;
    sum: number;
    message: string;
    date: Date;
    type: TransactionType;
  }) => void;
  editingOperation?: ActionResponse | null;
  onCancelEdit?: () => void;
};

export const TransactionForm: React.FC<Props> = ({
  categories,
  onSubmit,
  editingOperation,
  onCancelEdit
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sum, setSum] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<TransactionType>('Расход');

  // При изменении editingOperation заполняем форму
  useEffect(() => {
    if (editingOperation) {
      setSelectedCategoryId(editingOperation.category_id);
      setMessage(editingOperation.message);
      setSum(editingOperation.sum);
      setDate(new Date(editingOperation.date));
      setType(editingOperation.type as TransactionType);
    } else {
      // Сброс формы
      setSelectedCategoryId(null);
      setMessage('');
      setSum(0);
      setDate(new Date());
      setType('Расход');
    }
  }, [editingOperation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    onSubmit({
      category_id: selectedCategoryId,
      sum,
      message,
      date,
      type,
    });
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
            value={sum}
            onChange={(e) => setSum(parseFloat(e.target.value))}
            min={0}
            step={0.01}
          />
        </div>

        <div className={styles.fieldGroup}>
          <DatePicker
            selected={date}
            onChange={(date) => date && setDate(date)}
            dateFormat="dd.MM.yyyy"
            placeholderText="Дата"
          />
        </div>

        <div className={styles.fieldGroup}>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="type"
                value="Доход"
                checked={type === 'Доход'}
                onChange={() => setType('Доход')}
              />
              Доход
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="Расход"
                checked={type === 'Расход'}
                onChange={() => setType('Расход')}
              />
              Расход
            </label>
          </div>
        </div>

        <button type="submit" disabled={!selectedCategoryId}>
          {editingOperation ? 'Сохранить изменения' : 'Создать'}
        </button>
      </div>
    </form>
  );
};
