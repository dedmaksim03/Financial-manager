import { makeAutoObservable } from "mobx";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru"; // подключаем русскую локаль

dayjs.locale("ru");

export type DateMode = "month" | "year" | "all";

class DateStore {

  selectedDate: Dayjs = dayjs(); // по умолчанию текущий месяц
  mode: DateMode = "month";

  constructor() {
    makeAutoObservable(this);
  }

  setMode(newMode: DateMode) {
    this.mode = newMode;
    if (newMode === "all") {
      this.selectedDate = dayjs(); // можно обнулить если нужно
    }
  }

  next() {
    if (this.mode === "month") {
      this.selectedDate = this.selectedDate.add(1, "month");
    } else if (this.mode === "year") {
      this.selectedDate = this.selectedDate.add(1, "year");
    }
  }

  prev() {
    if (this.mode === "month") {
      this.selectedDate = this.selectedDate.subtract(1, "month");
    } else if (this.mode === "year") {
      this.selectedDate = this.selectedDate.subtract(1, "year");
    }
  }

  get formattedDate() {
    if (this.mode === "month") {
      return this.selectedDate.format("MMMM YYYY");
    } else if (this.mode === "year") {
      return this.selectedDate.format("YYYY");
    } else {
      return "За всё время";
    }
  }
}

const dateStore = new DateStore();
export default dateStore;
