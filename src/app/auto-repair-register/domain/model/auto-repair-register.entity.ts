import { BaseEntity } from '@shared/infrastructure/http/base-entity';

export class AutoRepairRegister implements BaseEntity {
  private _id_auto_repair: string;
  private _RUC: string;
  private _contact_email: string;
  private _technicians_count: number;
  private _id_location: string;

  constructor(autoRepair: {
    id_auto_repair: string;
    RUC: string;
    contact_email: string;
    technicians_count: number;
    id_location: string;
  }) {
    this._id_auto_repair = autoRepair.id_auto_repair;
    this._RUC = autoRepair.RUC;
    this._contact_email = autoRepair.contact_email;
    this._technicians_count = autoRepair.technicians_count;
    this._id_location = autoRepair.id_location;
  }

  // Getters y Setters

  get id(): string {
    return this._id_auto_repair;
  }
  set id(value: string) {
    this._id_auto_repair = value;
  }

  get RUC(): string {
    return this._RUC;
  }
  set RUC(value: string) {
    this._RUC = value;
  }

  get contact_email(): string {
    return this._contact_email;
  }
  set contact_email(value: string) {
    this._contact_email = value;
  }

  get technicians_count(): number {
    return this._technicians_count;
  }
  set technicians_count(value: number) {
    this._technicians_count = value;
  }

  get id_location(): string {
    return this._id_location;
  }
  set id_location(value: string) {
    this._id_location = value;
  }
}
