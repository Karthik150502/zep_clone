

export type JoinRoomType = {
    type: string,
    payload: {
        spaceId: string,
        token: string,
        userId: string
    }
}