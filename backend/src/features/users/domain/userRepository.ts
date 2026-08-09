import { User } from "./User.js";

export interface IUserRepository {
     create(user:User):Promise<User>;
     findAll():Promise<User[]>;
     findById(id:number):Promise<User|null>;
     findByEmail(email:string):Promise<User|null>;
}
