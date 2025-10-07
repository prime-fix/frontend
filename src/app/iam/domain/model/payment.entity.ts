import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a payment method associated with a user account.
 */
export class Payment implements BaseEntity {
  _id_payment: string;
  _card_number: number;
  _card_type: string;
  _month: number;
  _year: number;
  _cvv: number
  _id_user_account: string;

  /**
   * Creates a new Payment instance.
   * @param payment - An object containing payment details.
   */
  constructor(payment: {
    id_payment: string;
    card_number: number;
    card_type: string;
    month: number;
    year: number;
    cvv: number;
    id_user_account: string;
  }) {
    this._id_payment = payment.id_payment;
    this._card_number = payment.card_number;
    this._card_type = payment.card_type;
    this._month = payment.month;
    this._year = payment.year;
    this._cvv = payment.cvv;
    this._id_user_account = payment.id_user_account;
  }

  /** Getters and Setters */
  get id (): string { return this._id_payment; }
  set id (value: string) { this._id_payment = value; }
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
  get id_user_account (): string { return this._id_user_account; }
  set id_user_account (value: string) { this._id_user_account = value; }
}
