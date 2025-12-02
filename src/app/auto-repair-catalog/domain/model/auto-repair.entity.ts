import { BaseEntity } from '@shared/infrastructure/http/base-entity';

/**
 * Represents an Auto Repair entity.
 */
export class AutoRepair implements BaseEntity {
  /**
   * The unique identifier for the auto repair.
   * @private
   */
  private _id: number;

  /**
   * The RUC (Taxpayer Identification Number) of the auto repair.
   * @private
   */
  private _ruc: string;

  /**
   * The contact email of the auto repair.
   * @private
   */
  private _contact_email: string;

  /**
   * The number of technicians associated with the auto repair.
   * @private
   */
  private _technicians_count: number;

  /**
   * The user account ID associated with the auto repair.
   * @private
   */
  private _user_account_id: number;

  /**
   * Creates an instance of AutoRepair.
   * @param autoRepair - An object containing the properties of the auto repair.
   */
  constructor(autoRepair: {
    id: number;
    ruc: string;
    contact_email: string;
    technicians_count: number;
    user_account_id: number;
  }) {
    this._id = autoRepair.id;
    this._ruc = autoRepair.ruc;
    this._contact_email = autoRepair.contact_email;
    this._technicians_count = autoRepair.technicians_count;
    this._user_account_id = autoRepair.user_account_id;
  }

  /* --- Getters & Setters --- */
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get ruc(): string {
    return this._ruc;
  }
  set ruc(value: string) {
    this._ruc = value;
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

  get user_account_id(): number {
    return this._user_account_id;
  }

  set user_account_id(value: number) {
    this._user_account_id = value;
  }
}
