import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.css';
import { CategoryResponse } from '../../models/response/CategoryResponse';

type TransactionType = 'Доход' | 'Расход';

type Props = {
  categories: CategoryResponse[];
  onSubmit: (data: {
    categoryId: number;
    amount: number;
    message: string;
    date: Date;
    type: TransactionType;
  }) => void;
};

export const TransactionForm: React.FC<Props> = ({ categories, onSubmit }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [type, setType] = useState<TransactionType>('Расход');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId) return;

    onSubmit({
      categoryId: selectedCategoryId,
      amount,
      message,
      date,
      type,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.transactionForm}>
      <div className={styles.palette}>
        {categories.map((category) => {
            console.log(category.sum, category.id)
          const amount = category.sum || 0;
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
                <div className={styles.categoryAmount}>{amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</div>
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
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
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

    <button type="submit" disabled={!selectedCategoryId}>Сохранить</button>
  </div>
</form>
  );
};
