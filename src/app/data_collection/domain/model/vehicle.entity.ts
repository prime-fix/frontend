import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class Vehicle implements BaseEntity{
 _id_vehicle: number;
 _color: string;
 _model: string;
 _id_user: number;
 _vehicle_brand: string;
 _vehicle_plate: string;
 _vehicle_type: string;

  constructor( vehicle:{ id_vehicle:number, color:string, model:string, id_user:number, vehicle_brand:string,
  vehicle_plate:string, vehicle_type:string}) {
    this._id_vehicle=vehicle.id_vehicle;
    this._color=vehicle.color;
    this._model=vehicle.model;
    this._id_user=vehicle.id_user;
    this._vehicle_brand=vehicle.vehicle_brand;
    this._vehicle_plate=vehicle.vehicle_plate;
    this._vehicle_type=vehicle.vehicle_type;
  }

  get id():  number {return this._id_vehicle;}
  get color(): string {return this._color;}
  get model(): string {return this._model;}
  get id_user(): number {return this._id_user;}
  get vehicle_brand(): string {return this._vehicle_brand;}
  get vehicle_plate(): string {return this._vehicle_plate;}
  get vehicle_type(): string {return this._vehicle_type;}

  set id(value: number) {this._id_vehicle = value;}
  set color(value: string) {this._color = value;}
  set model(value: string) {this._model = value;}
  set id_user(value: number) {this._id_user = value;}
  set vehicle_brand(value: string) {this._vehicle_brand = value;}
  set vehicle_plate(value: string) {this._vehicle_plate = value;}
  set vehicle_type(value: string) {this._vehicle_type = value;}


}
