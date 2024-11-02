

// Maps room names to sets of WebSocket clients

import { WebSocket } from "ws";
import { SpacesInfo } from "../types/websockets";




// spaceId - Websocket connections;
export const SPACES: SpacesInfo = new Map();
