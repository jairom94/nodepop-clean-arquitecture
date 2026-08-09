export class User {
    private _id:number|null;
    private _name:string;
    private _lastname1:string;
    private _email:string;
    private _password:string;

    constructor({id=null,name,lastname1,email,password}:{id:number|null;name:string;lastname1:string;email:string;password:string}){
        this._id = id;
        this._name = name;
        this._lastname1 = lastname1;
        this._email = email;
        this._password = password;
    }
    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    get lastname1(){
        return this._lastname1;
    }
    get email(){
        return this._email;
    }
    get password(){
        return this._password;
    }
}
