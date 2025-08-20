import $api from '../http';
import { AxiosResponse } from 'axios';
import { ActionResponse } from '../models/response/ActionResponse';

export default class ActionsService {

  static async getActions(): Promise<AxiosResponse<ActionResponse[]>> {
    return $api.get('/actions/get');
  }
}