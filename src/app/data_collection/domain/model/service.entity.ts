import {BaseEntity} from '@shared/infrastructure/http/base-entity';

export class Service implements BaseEntity {
   _id_service: number;
   _name: string;
   _description: string;

  constructor(service: { id_service: number; name: string; description: string }) {
    this._id_service = service.id_service;
    this._name = service.name;
    this._description = service.description;
  }

  get id(): number {return this._id_service;}
  get name(): string {return this._name;}
  get description(): string {return this._description;}

  set id(value: number) {this._id_service = value;}
  set name(value: string) {this._name = value;}
  set description(value: string) {this._description = value;}
}
