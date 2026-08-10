import { User } from "./User.js";

export interface IUserRepository {
     create(user:User):Promise<User>;
     findAll():Promise<User[]>;
     findById(id:number):Promise<User|null>;
     findByEmail(email:string):Promise<User|null>;
     update(id:number, data:{name:string;lastname1:string;email:string}):Promise<User>;
}
