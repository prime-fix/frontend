import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class ServiceOffer implements BaseEntity {

  private _service_offer_id:string;

  private _id_service:string;

  private _id_auto_repair:string;

  private _price:number;

  private _is_active:boolean;

  private _duration_hour:number;


  constructor(serviceOffer:{
    service_offer_id:string;
    id_service:string;
    id_auto_repair:string;
    price:number;
    is_active:boolean;
    duration_hour:number;
  }) {
    this._service_offer_id = serviceOffer.service_offer_id;
    this._id_service = serviceOffer.id_service;
    this._id_auto_repair = serviceOffer.id_auto_repair;
    this._price = serviceOffer.price;
    this._is_active = serviceOffer.is_active;
    this._duration_hour = serviceOffer.duration_hour
  }


  get id(): string{
    return this._service_offer_id;
  }

  set id(value:string){
    this._service_offer_id = value;
  }

  get service_id(): string{
    return this._id_service;
  }

  set service_id(value:string){
    this._id_service = value;
  }

  get auto_repair_id():string{
    return this._id_auto_repair;
  }

  set auto_repair_id(value :string){
    this._id_auto_repair = value;
  }

  get price(): number{
    return this._price;
  }

  set price(value:number){
    this._price = value;
  }

  get is_active():boolean{
    return this._is_active;
  }

  set is_active(value:boolean){
    this._is_active = value
  }
  get duration_hour():number{
    return this._duration_hour;
  }

  set duration_hour(value:number){
    this._duration_hour = value;
  }


}
