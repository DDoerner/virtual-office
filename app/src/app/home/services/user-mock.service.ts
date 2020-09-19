import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const USER_ID_STORAGE_KEY = 'virtual-office-user-id';
const USER_STORAGE_KEY = 'virtual-office-user';
const USER_ID = 'franzl';
const ROOM_ID = 'HERE';

@Injectable()
export class UserService {

  constructor() { }

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
    await new Promise(res => setTimeout(res, 1_500));

    user.userId = USER_ID;
    this.user = user;
  }

  public getUser(): User {
    return this.user;
  }

  public async getOtherUsers(): Promise<User[]> {
    await new Promise(res => setTimeout(res, 1_500));

    const users: User[] = [
      {
        username: 'Gerda',
        peerId: 'gerda-5',
        roomId: ROOM_ID
      },
      {
        username: 'Theo',
        peerId: 'theo-3',
        roomId: ROOM_ID
      },
      {
        username: 'Bob',
        peerId: 'bob-8',
        roomId: ROOM_ID
      }
    ];
    return users;
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
