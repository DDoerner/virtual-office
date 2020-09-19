import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { TableAdapter } from "../helpers/table-adapter";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    const tableAdapter = new TableAdapter();
    const roomId = await tableAdapter.createRoom();
        
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: roomId,
        headers: {   
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Request-Headers': 'X-Custom-Header'
        }
    };

};

export default httpTrigger;