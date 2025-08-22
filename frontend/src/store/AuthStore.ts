import { makeAutoObservable } from 'mobx';
import AuthService from '../services/AuthService';
import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';
import { UserRequest } from '../models/request/UserRequest';

export default class AuthStore {
  isAuth = false;
  isLoading = true;
  username = '';

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUsername(username: string) {
    this.username = username
  }
  
  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  async login(userRequest: UserRequest) {
    this.setLoading(true)
    try {
        console.log('store login')
        const response = await AuthService.login(userRequest);
        console.log(response);
        localStorage.setItem('access_token', response.data.access_token);
        this.setAuth(true);
        this.setLoading(false)
        this.setUsername(response.data.username)
    } catch (e: any) {
        this.setAuth(false);
        this.setLoading(false)
      console.log(e.response?.data?.message);
    }
  }

  async logout() {
    this.setLoading(true)
    try {
      const response = await AuthService.logout();
      console.log(response);
      localStorage.removeItem('access_token');
      this.setAuth(false);
      this.setLoading(false)
    } catch (e: any) {
        this.setAuth(true);
        this.setLoading(false)
      console.log(e.response?.data?.message);
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
      console.log(response);
      localStorage.setItem('access_token', response.data.access_token)
      this.setAuth(true)
      this.setLoading(false)
      this.setUsername(response.data.username)
    } catch (e: any) {
        this.setAuth(false)
        this.setLoading(false)
      console.log(e.response?.data?.message);
    }
  }

  async registration(userRequest: UserRequest) {
    this.setLoading(true)
    try {
        const response = await AuthService.registration(userRequest);
        console.log(response);
        localStorage.setItem('access_token', response.data.access_token);
        this.setAuth(true);
        this.setLoading(false)
        this.setUsername(response.data.username)
      } catch (e: any) {
        this.setAuth(false);
        this.setLoading(false)
        console.log(e.response?.data?.message);
      }
  }
}