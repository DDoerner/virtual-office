import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TableAdapter } from "../helpers/table-adapter";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    
    if (!req?.body?.roomId || !req?.body?.username || !req?.body?.peerId) {
        context.res = {
            status: 400,
            body: 'Missing parameters'
        };
        return;
    }
    
    const tableAdapter = new TableAdapter();
    const room = await tableAdapter.getRoom(req.body.roomId);
    if (!room) {
        context.res = {
            status: 400,
            body: 'Room does not exist'
        };
        return;
    }

    const userId = await tableAdapter.createUser(req.body.roomId, req.body.username, req.body.peerId);
    context.log('New user created: ' + userId);

    const users = await tableAdapter.getUsers(req.body.roomId);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            users: users.map(u => {
                return {
                    peerId: u.peerId,
                    username: u.username
                };
            }),
            userId
        }
    };

};

export default httpTrigger;