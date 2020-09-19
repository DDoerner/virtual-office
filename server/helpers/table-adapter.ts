import azurestorage = require('azure-storage');
import azstorage = require('azure-storage');
import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, Room, User } from './types';

export class TableAdapter {

    public async createRoom(): Promise<string> {
        const id = this.generateCode(4);
        const room: Room = {
            id,
            createdAt: this.getTimestamp()
        }
        await this.saveToTable('rooms', room);
        return id;
    }

    public async getRoom(id: string): Promise<Room> {
        const table = azstorage.createTableService(process.env.coronazaehler_STORAGE);
        const user = await new Promise((resolve) => table.retrieveEntity('rooms', id, id, (err, result, resp) => resolve(result)));
        return user as Room;
    }

    public async getUser(id: string): Promise<User> {
        const table = azstorage.createTableService(process.env.coronazaehler_STORAGE);
        const user = await new Promise((resolve) => table.retrieveEntity('users', id, id, (err, result, resp) => resolve(result)));
        return this.convertFromTableObject(user) as User;
    }

    public async getUsers(roomId: string): Promise<User[]> {
        var table = azstorage.createTableService(process.env.coronazaehler_STORAGE);
        const query = new azurestorage.TableQuery().where('roomId eq ?', roomId);
        const users: any[] = await new Promise((resolve) => table.queryEntities('users', query, null, (err, result, resp) => resolve(result.entries)));
        return users.map(u => this.convertFromTableObject(u)) as User[];
    }

    public async createUser(roomId: string, username: string, peerId: string): Promise<string> {
        const id = uuidv4();
        const now = this.getTimestamp();
        const user: User = {
            id,
            peerId,
            username,
            roomId,
            createdAt: now,
            updatedAt: now
        }
        await this.saveToTable('users', user);
        return id;
    }

    private async saveToTable(tableName: string, entity: BaseEntity): Promise<void> {
        
        entity['RowKey'] = entity.id;
        entity['PartitionKey'] = entity.id;
        entity['Timestamp'] = entity.createdAt;

        const table = azstorage.createTableService(process.env.coronazaehler_STORAGE);
        const tableObj = this.convertToTableObject(entity);
        await new Promise((resolve) => 
            table.insertOrReplaceEntity(tableName, tableObj, () => resolve())
        );
    }

    private convertToTableObject(obj: any): Object {
        const task = {};
        for (let prop of Object.keys(obj)) {
            task[prop] = {'_': obj[prop]};
        }
        return task;
    }

    private convertFromTableObject(obj: any): Object {
        const task = {};
        for (let prop of Object.keys(obj)) {
            if (prop.startsWith('.')) {
                continue;
            }
            task[prop] = obj[prop]['_'];
        }
        return task;
    }

    private getTimestamp() {
        return new Date().toISOString();
    }
    
    private generateCode(length: number) {
        var result: string = '';
        var chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charCount = chars.length;
        for ( var i = 0; i < length; i++ ) {
           result += chars.charAt(Math.floor(Math.random() * charCount));
        }
        return result;
     }
}