declare namespace Express {
    export interface Request {
       uid?: string,
       firstName?:string,
       cookies?:string
    }
 }