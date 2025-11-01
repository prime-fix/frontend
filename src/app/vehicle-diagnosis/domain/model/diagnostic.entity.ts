import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Diagnostic entity.
 */
export class Diagnostic implements BaseEntity {
  /**
   * The unique identifier for the diagnostic.
   */
  _id_diagnostic: string;
  /**
   * The price of the diagnostic.
   */
  _price: number;
  /**
   * The vehicle ID associated with the diagnostic.
   */
  _id_vehicle: string;
  /**
   * The diagnosis details.
   */
  _diagnosis: string;
  /**
   * The expected ID associated with the diagnostic.
   */
  _id_expected: string;

  /**
   * Creates an instance of Diagnostic.
   * @param {Object} diagnostic - An object containing the properties of the diagnostic.
   * @property {string} diagnostic.id_diagnostic - The unique identifier for the diagnostic.
   * @property {number} diagnostic.price - The price of the diagnostic.
   * @property {string} diagnostic.id_vehicle - The vehicle ID associated with the diagnostic.
   * @property {string} diagnostic.diagnosis - The diagnosis details.
   * @property {string} diagnostic.id_expected - The expected ID associated with the diagnostic.
   */
  constructor(diagnostic: { id_diagnostic: string; price: number; id_vehicle: string; diagnosis: string; id_expected: string }) {
    this._id_diagnostic = diagnostic.id_diagnostic;
    this._price = diagnostic.price;
    this._id_vehicle = diagnostic.id_vehicle;
    this._diagnosis = diagnostic.diagnosis;
    this._id_expected = diagnostic.id_expected;
  }
  /* --- Getters & Setters --- */
  get id(): string { return this._id_diagnostic; }
  set id(id: string) { this._id_diagnostic = id; }
  get price(): number { return this._price; }
  set price(price: number) { this._price = price; }
  get id_vehicle(): string { return this._id_vehicle; }
  set id_vehicle(id_vehicle: string) { this._id_vehicle = id_vehicle; }
  get diagnosis(): string { return this._diagnosis; }
  set diagnosis(diagnosis: string) { this._diagnosis = diagnosis; }
  get id_expected(): string { return this._id_expected; }
  set id_expected(id_expected: string) { this._id_expected = id_expected; }
}
