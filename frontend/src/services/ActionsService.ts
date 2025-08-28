import $api from '../http';
import { AxiosResponse } from 'axios';
import { ActionResponse } from '../models/response/ActionResponse';

export default class ActionsService {

  static async getActions(dateFrom: string, dateTo: string): Promise<AxiosResponse<ActionResponse[]>> {
    return $api.get('/actions/get', {
      params: {
        dateFrom: dateFrom, //"2021-07-19",
        dateTo: dateTo //"2025-08-19"
      }
    });
  }

  static async createAction(type: string, message: string, sum: number, date: string, category_id: number): Promise<void> {
    return $api.post('/actions/create', {
        "type": type,
        "message": message,
        "sum": sum,
        "date": date,
        "category_id": category_id
    });
  }

  static async deleteAction(action_id: number): Promise<void> {
    return $api.delete(`/actions/${action_id}`)
  }
}