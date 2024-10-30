interface AuthUser {
    id: number,
    username: string,
    firstname: string,
    lastname: string,
}



declare namespace Express {
    export interface Request {
        user?: AuthUser
    }
}