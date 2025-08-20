import $api from '../http';
import { AxiosResponse } from 'axios';
import { ActionResponse } from '../models/response/ActionResponse';
import { CategoryResponse } from '../models/response/CategoryResponse';

export default class CategoriesService {

  static async getCategories(dateFrom: string, dateTo: string): Promise<AxiosResponse<CategoryResponse[]>> {
    return $api.get('/categories/get', {
      params: {
        dateFrom: dateFrom, //"2021-07-19",
        dateTo: dateTo //"2025-08-19"
      }
    });
  }
}