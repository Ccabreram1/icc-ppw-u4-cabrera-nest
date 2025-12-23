export class Product {
    id: number;
    name: string;
    description: string;
    price: string;
    createdAT: Date;

    constructor(id: number, name: string, description: string, price: string) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.createdAT = this.createdAT;

    }
}