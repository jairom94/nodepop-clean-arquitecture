import { Tag } from "./Tag.js";

export interface ITagRepository {
     create(tag:Tag):Promise<Tag>;
     findAll():Promise<Tag[]>;
     findById(id:number):Promise<Tag|null>;
     findByName(name:string):Promise<Tag|null>;
     update(id:number, data:{name:string}):Promise<Tag>;
     delete(id:number):Promise<void>;
     /** true si algún producto de otro usuario usa el tag. */
     isUsedByOtherOwners(id:number, ownerId:number):Promise<boolean>;
}