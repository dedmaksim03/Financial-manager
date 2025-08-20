import $api from '../http';
import { AxiosResponse } from 'axios';
import { ActionResponse } from '../models/response/ActionResponse';

export default class ActionsService {

  static async getActions(): Promise<AxiosResponse<ActionResponse[]>> {
    return $api.get('/actions/get');
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
    static async logout(): Promise<void> {
    return $api.post('/auth/logout');
  }
}