import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class Repair implements BaseEntity{
    _id_auto_repair: number | string ;
   _RUC: string;
   _contact_email: string;
   _technician_count: number;

  constructor(data: {id_auto_repair: number|string, RUC: string, contact_email: string, technician_count: number}) {
    this._id_auto_repair = data.id_auto_repair;
    this._RUC = data.RUC;
    this._contact_email = data.contact_email;
    this._technician_count = data.technician_count;
  }

  get id(): number |string{return this._id_auto_repair;}
  get RUC(): string {return this._RUC;}
  get contact_email(): string {return this._contact_email;}
  get technician_count(): number {return this._technician_count;}

  set id(value: number | string) {this._id_auto_repair = value;}
  set RUC(value: string) {this._RUC = value;}
  set contact_email(value: string) {this._contact_email = value;}
  set technician_count(value: number) {this._technician_count = value;}

}
