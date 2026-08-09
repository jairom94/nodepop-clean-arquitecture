import { Product } from "./Product.js";

export interface IProductRepository {
     create(product:Product):Promise<Product>;
     findAll():Promise<Product[]>;
     findById(id:number):Promise<Product|null>;
     findByOwnerId(ownerId:number):Promise<Product[]>;
}
