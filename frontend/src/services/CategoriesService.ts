import $api from '../http';
import { AxiosResponse } from 'axios';
import { ActionResponse } from '../models/response/ActionResponse';
import { CategoryResponse } from '../models/response/CategoryResponse';
import { CategoryRequest } from '../models/request/CategoryRequest';

export default class CategoriesService {

  static async getCategories(dateFrom: string, dateTo: string): Promise<AxiosResponse<CategoryResponse[]>> {
    return $api.get('/categories/get', {
      params: {
        dateFrom: dateFrom, //"2021-07-19",
        dateTo: dateTo //"2025-08-19"
      }
    });
  }

  static async createCategory(categoryRequest: CategoryRequest): Promise<AxiosResponse<void>> {
    return $api.post('/categories/create', categoryRequest)
  }  

  static async deleteCategory(categoryId: number): Promise<AxiosResponse<void>> {
    return $api.delete(`/categories/${categoryId}?forceDelete=true`)
  }    
}