import React, { useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
import CategoriesService from '../../services/CategoriesService';
import { Button } from "antd";

type TransactionType = 'Доход' | 'Расход';

type Props = {
  onCreate: () => void;
};

export const CreateCategoryForm: React.FC<Props> = ({ onCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#000000');
  const [type, setType] = useState<TransactionType>('Расход');

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCreate = () => {
    if (!name.trim()) {
      alert('Введите название категории');
      return;
    }

    CategoriesService.createCategory({
      name: name, 
      color: color,
      type: type
    }).then(() => onCreate())

    setIsOpen(false);
    setName('');
    setColor('#000000');
    setType('Расход');
  };

  return (
    <div className={styles.container} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Добавить категорию"
        className={styles.button}
        type="button"
      >
        ➕
      </button>

      {isOpen && (
        <div className={styles.popup}>
          <div className={styles.field}>
            <label>
              <p>Название:</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название категории"
                className={styles.inputText}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label>
              <p>Цвет:</p>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles.inputColor}
              />
            </label>
          </div>

          <div className={styles.field}>
            <label>
              <p>Тип:</p>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                className={styles.select}
              >
                <option value="Расход">Расход</option>
                <option value="Доход">Доход</option>
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
            <Button color="primary" variant="filled" onClick={handleCreate}>
              Создать
            </Button>
          </div>


          {/* <button onClick={handleCreate} className={styles.createButton} type="button">
            Создать
          </button> */}
        </div>
      )}
    </div>
  );
};
