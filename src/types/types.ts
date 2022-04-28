
export interface IUser {
    _id:string,
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    organization?: string,
    status: boolean,
    rol: string[],
    google: boolean,
    refreshToken: string

}