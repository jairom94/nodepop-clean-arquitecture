export class Tag {
    private _id:number|null;
    private _name:string;

    constructor({id=null,name}:{id:number|null;name:string}){
        this._id = id;
        this._name = name;
    }
    get name(){
        return this._name;
    }
    get id(){
        return this._id;
    }
}