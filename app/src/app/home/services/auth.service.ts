import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const USER_ID_STORAGE_KEY = 'virtual-office-user-id';
const USER_STORAGE_KEY = 'virtual-office-user';

@Injectable()
export class AuthService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private get userId(): string {
    return localStorage.getItem(USER_ID_STORAGE_KEY);
  }
  private set userId(value: string) {
    localStorage.setItem(USER_ID_STORAGE_KEY, value);
  }

  private get user(): User {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) as User;
  }
  private set user(value: User) {
    this.userId = value?.userId;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
  }

  public isLoggedIn(): boolean {
    return this.userId !== null;
  }

  public async register(user: User): Promise<void> {
    const response: any = await this.httpClient.post(environment.API_URL + 'register-user', user).toPromise();
    const userId: string = response.userId;

    user.userId = userId;
    this.user = user;
  }

  public logout() {
    this.user = null;
  }
}

export type User = {
  userId?: string,
  peerId: string,
  username: string,
  roomId: string,
}
