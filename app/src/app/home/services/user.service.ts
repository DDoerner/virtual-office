import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const USER_ID_STORAGE_KEY = 'virtual-office-user-id';
const USER_STORAGE_KEY = 'virtual-office-user';

@Injectable()
export class UserService {

  constructor() { }

  private get userId(): string {
    return localStorage.getItem(USER_ID_STORAGE_KEY);
  }
  private set userId(value: string) {
    if (!value) {
      localStorage.removeItem(USER_ID_STORAGE_KEY);
    } else {
      localStorage.setItem(USER_ID_STORAGE_KEY, value);
    }
  }

  private get user(): User {
    return JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) as User;
  }
  private set user(value: User) {
    this.userId = value?.userId ?? null;
    if (!value) {
      localStorage.removeItem(USER_STORAGE_KEY);
    } else {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(value));
    }
  }

  public isLoggedIn(): boolean {
    return this.userId !== null && this.userId !== undefined;
  }

  public async register(user: User): Promise<void> {
    const userId = await fetch(environment.API_URL + 'register-user', {
      method: 'POST',
      body: JSON.stringify(user)
    }).then(res => res.text());

    user.userId = userId;
    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }

  public async getOtherUsers(): Promise<User[]> {
    const users = await fetch(environment.API_URL + 'get-users?userId=' + this.userId, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());
    const myPeerId = this.getUser().peerId;
    return users.filter(u => u.peerId !== myPeerId);
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
};
