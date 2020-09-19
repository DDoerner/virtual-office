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

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: userId
    };

};

export default httpTrigger;