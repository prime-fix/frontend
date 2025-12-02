import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a payment method associated with a user account.
 */
export class Payment implements BaseEntity {
  _id: number;
  _card_number: number;
  _card_type: string;
  _month: number;
  _year: number;
  _cvv: number
  _user_account_id: number;

  /**
   * Creates a new Payment instance.
   * @param payment - An object containing payment details.
   */
  constructor(payment: {
    id: number;
    card_number: number;
    card_type: string;
    month: number;
    year: number;
    cvv: number;
    user_account_id: number;
  }) {
    this._id = payment.id;
    this._card_number = payment.card_number;
    this._card_type = payment.card_type;
    this._month = payment.month;
    this._year = payment.year;
    this._cvv = payment.cvv;
    this._user_account_id = payment.user_account_id;
  }

  /** Getters and Setters */
  get id (): number { return this._id; }
  set id (value: number) { this._id = value; }
  get card_number (): number { return this._card_number; }
  set card_number (value: number) { this._card_number = value; }
  get card_type (): string { return this._card_type; }
  set card_type (value: string) { this._card_type = value; }
  get month (): number { return this._month; }
  set month (value: number) { this._month = value; }
  get year (): number { return this._year; }
  set year (value: number) { this._year = value; }
  get cvv (): number { return this._cvv; }
  set cvv (value: number) { this._cvv = value; }
  get user_account_id (): number { return this._user_account_id; }
  set user_account_id (value: number) { this._user_account_id = value; }
}
