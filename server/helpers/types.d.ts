export type BaseEntity = {
    id: string,
    createdAt: string
}

export type User = BaseEntity & {
    peerId: string,
    username: string,
    roomId: string,
    updatedAt: string
}

export type Room = BaseEntity & {
}