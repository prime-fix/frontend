import { BaseEntity } from '@shared/infrastructure/http/base-entity';

/**
 * Represents an Auto Repair entity.
 */
export class AutoRepair implements BaseEntity {
  /**
   * The unique identifier for the auto repair.
   * @private
   */
  private _id_auto_repair: string;

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
  private _id_user_account: string;

  /**
   * Creates an instance of Auto Repair.
   * @param {Object} autoRepair - An object containing the properties of the auto repair.
   * @property {string} autoRepair.id_auto_repair - The unique identifier for the auto repair.
   * @property {string} autoRepair.ruc - The RUC of the auto repair.
   * @property {string} autoRepair.contact_email - The contact email of the auto repair.
   * @property {number} autoRepair.technicians_count - The number of technicians.
   * @property {string} autoRepair.id_user_account - The user account ID.
   */
  constructor(autoRepair: {
    id_auto_repair: string;
    ruc: string;
    contact_email: string;
    technicians_count: number;
    id_user_account: string;
  }) {
    this._id_auto_repair = autoRepair.id_auto_repair;
    this._ruc = autoRepair.ruc;
    this._contact_email = autoRepair.contact_email;
    this._technicians_count = autoRepair.technicians_count;
    this._id_user_account = autoRepair.id_user_account;
  }

  /* --- Getters & Setters --- */
  get id(): string {
    return this._id_auto_repair;
  }
  set id(value: string) {
    this._id_auto_repair = value;
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

  get id_user_account(): string {
    return this._id_user_account;
  }

  set id_user_account(value: string) {
    this._id_user_account = value;
  }
}
