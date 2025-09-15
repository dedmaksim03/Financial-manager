// CategoryFormModal.tsx
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

export type TransactionType = 'Доход' | 'Расход';

export interface CategoryFormData {
  name: string;
  color: string;
  type: TransactionType;
}

export interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
}

const CategoryFormModal: React.FC<CategoryFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty, isValid },
  } = useForm<CategoryFormData>({
    defaultValues: initialData || {
      name: '',
      color: '#1976d2',
      type: 'Расход',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      reset(initialData || {
        name: '',
        color: '#1976d2',
        type: 'Расход',
      });
    }
  }, [initialData, open, reset]);

  const isEditMode = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? 'Редактировать категорию' : 'Создать категорию'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          <Controller
            name="name"
            control={control}
            rules={{ required: 'Название обязательно' }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Название"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Цвет"
                type="color"
                InputLabelProps={{ shrink: true }}
              />
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="type-label">Тип</InputLabel>
                <Select
                  {...field}
                  labelId="type-label"
                  label="Тип"
                >
                  <MenuItem value="Расход">Расход</MenuItem>
                  <MenuItem value="Доход">Доход</MenuItem>
                </Select>
              </FormControl>
            )}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={!isValid && !isDirty}>
            Сохранить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CategoryFormModal;
