import { Product } from "./Product.js";

export interface IProductRepository {
     create(product:Product):Promise<Product>;
     findAll():Promise<Product[]>;
     findById(id:number):Promise<Product|null>;
     findByOwnerId(ownerId:number, skip?:number, take?:number):Promise<Product[]>;
     countByOwnerId(ownerId:number):Promise<number>;
     update(id:number, data:{name:string;price:number;image:string|null;tags:string[]}):Promise<Product>;
     delete(id:number):Promise<void>;
}
