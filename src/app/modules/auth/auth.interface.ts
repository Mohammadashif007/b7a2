export interface IAuth {
    name: string;
    email: string;
    password: string;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer";
    createdAt: Date;
    updatedAt: Date;
}
