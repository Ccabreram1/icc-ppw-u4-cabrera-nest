export class User {
    id: number;
    name: string;
    email: string;
    pasword: string;
    createdAT: Date;

    constructor(id: number, name: string, email: string, pasword: string) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.pasword = pasword;
        this.createdAT = new Date();
    }

}