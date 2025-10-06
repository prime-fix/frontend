import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class Repair implements BaseEntity{
    _id: number;
   _RUC: string;
   _contact_email: string;
   _technician_count: number;

  constructor(data: {id: number, RUC: string, contact_email: string, technician_count: number}) {
    this._id = data.id;
    this._RUC = data.RUC;
    this._contact_email = data.contact_email;
    this._technician_count = data.technician_count;
  }

  get id(): number {return this._id;}
  get RUC(): string {return this._RUC;}
  get contact_email(): string {return this._contact_email;}
  get technician_count(): number {return this._technician_count;}

  set id(value: number) {this._id = value;}
  set RUC(value: string) {this._RUC = value;}
  set contact_email(value: string) {this._contact_email = value;}
  set technician_count(value: number) {this._technician_count = value;}

}
