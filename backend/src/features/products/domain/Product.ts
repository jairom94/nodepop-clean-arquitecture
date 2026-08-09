import { Tag } from "../../tags/domain/Tag.js";

export class Product {
    private _id:number|null;
    private _name:string;
    private _price:number;
    private _ownerId:number;
    private _image:string|null;
    private _tags:Tag[];

    constructor({id=null,name,price,ownerId,image=null,tags=[]}:{id:number|null;name:string;price:number;ownerId:number;image:string|null;tags?:Tag[]}){
        this._id = id;
        this._name = name;
        this._price = price;
        this._ownerId = ownerId;
        this._image = image;
        this._tags = tags;
    }
    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    get price(){
        return this._price;
    }
    get ownerId(){
        return this._ownerId;
    }
    get image(){
        return this._image;
    }
    get tags(){
        return this._tags;
    }
}
