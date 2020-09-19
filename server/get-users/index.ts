import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TableAdapter } from "../helpers/table-adapter";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
   
    if (!req?.query?.userId) {
        context.res = {
            status: 400,
            body: 'Missing parameters'
        };
        return;
    }
    
    const tableAdapter = new TableAdapter();
    const user = await tableAdapter.getUser(req.body.userId);
    if (!user) {
        context.res = {
            status: 400,
            body: 'User does not exist'
        };
        return;
    }

    const users = await tableAdapter.getUsers(user.roomId);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: users.map(u => {
            return {
                peerId: u.peerId,
                username: u.username
            };
        })
    };

};

export default httpTrigger;