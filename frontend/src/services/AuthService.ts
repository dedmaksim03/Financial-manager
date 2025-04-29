import $api from '../http';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { UserRequest } from '../models/request/UserRequest';

export default class AuthService {
  static async login(userRequest: UserRequest): Promise<AxiosResponse<AuthResponse>> {
    return $api.post<AuthResponse>('/auth/login', userRequest );
  }

  static async logout(): Promise<void> {
    return $api.post('/auth/logout');
  }

  static async registration(userRequest: UserRequest): Promise<AxiosResponse<AuthResponse>> {
    return $api.post('/auth/registration', userRequest)
  }
}