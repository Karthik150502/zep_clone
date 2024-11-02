import websocket from 'ws';
import { handleClientReq } from '../lib/ws/ws';

import { Server } from "http"


export function initWebscokets(server: Server) {
    const wss = new websocket.Server({ server: server });


    wss.on('connection', function connection(ws: websocket) {
        console.log("Connected to the websockets......");

        ws.on('message', async (jsonString: string, isBinary) => {
            await handleClientReq(ws, wss, jsonString, isBinary);

        })
        ws.on('close', function close() {

        });
    })

} 