import { BaseEntity } from '@shared/infrastructure/http/base-entity';

export class TechnicianRegister implements BaseEntity {
  private _id_technician: string;
  private _name: string;
  private _age: number;
  private _id_user_account: string;
  private _id_auto_repair: string;

  constructor(technician: {
    id_technician: string;
    name: string;
    age: number;
    id_user_account: string;
    id_auto_repair: string;
  }) {
    this._id_technician = technician.id_technician;
    this._name = technician.name;
    this._age = technician.age;
    this._id_user_account = technician.id_user_account;
    this._id_auto_repair = technician.id_auto_repair;
  }

  // --- Getters & Setters ---

  get id(): string {
    return this._id_technician;
  }
  set id(value: string) {
    this._id_technician = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  get age(): number {
    return this._age;
  }
  set age(value: number) {
    this._age = value;
  }

  get id_user_account(): string {
    return this._id_user_account;
  }
  set id_user_account(value: string) {
    this._id_user_account = value;
  }

  get id_auto_repair(): string {
    return this._id_auto_repair;
  }
  set id_auto_repair(value: string) {
    this._id_auto_repair = value;
  }
}

