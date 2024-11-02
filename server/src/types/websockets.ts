import { WebSocket } from "ws"


export type JoinRoomType = {
    type: string,
    payload: {
        spaceId: string,
        token: string,
        userId: string
    }
}


export type SpaceUserType = {
    id: string,
    name: string,
    avatar?: string,
    position: {
        x: number
        y: number
    }
}

export type SpaceDataType = {
    connections: Set<WebSocket>,
    users: {
        [key: string]: SpaceUserType
    }
}


export type SpacesInfo = Map<String, SpaceDataType>; 