import { Tag } from "./Tag.js";

export interface ITagRepository {
     create(tag:Tag):Promise<Tag>;
     findAll():Promise<Tag[]>;
     findById(id:number):Promise<Tag|null>;
}