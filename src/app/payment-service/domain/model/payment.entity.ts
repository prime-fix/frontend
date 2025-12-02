import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a payment method associated with a user account.
 */
export class Payment implements BaseEntity {
  _id: number;
  _card_number: string;
  _card_type: string;
  _month: number;
  _year: number;
  _ccv: number
  _user_account_id: number;

  /**
   * Creates a new Payment instance.
   * @param payment - An object containing payment details.
   */
  constructor(payment: {
    id: number;
    card_number: string;
    card_type: string;
    month: number;
    year: number;
    ccv: number;
    user_account_id: number;
  }) {
    this._id = payment.id;
    this._card_number = payment.card_number;
    this._card_type = payment.card_type;
    this._month = payment.month;
    this._year = payment.year;
    this._ccv = payment.ccv;
    this._user_account_id = payment.user_account_id;
  }

  /** Getters and Setters */
  get id (): number { return this._id; }
  set id (value: number) { this._id = value; }
  get card_number (): string { return this._card_number; }
  set card_number (value: string) { this._card_number = value; }
  get card_type (): string { return this._card_type; }
  set card_type (value: string) { this._card_type = value; }
  get month (): number { return this._month; }
  set month (value: number) { this._month = value; }
  get year (): number { return this._year; }
  set year (value: number) { this._year = value; }
  get ccv (): number { return this._ccv; }
  set ccv (value: number) { this._ccv = value; }
  get user_account_id (): number { return this._user_account_id; }
  set user_account_id (value: number) { this._user_account_id = value; }
}
