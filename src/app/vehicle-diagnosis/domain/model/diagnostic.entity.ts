import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Diagnostic entity.
 */
export class Diagnostic implements BaseEntity {
  /**
   * The unique identifier for the diagnostic.
   */
  _id: number;
  /**
   * The price of the diagnostic.
   */
  _price: number;
  /**
   * The vehicle ID associated with the diagnostic.
   */
  _vehicle_id: number;
  /**
   * The diagnosis details.
   */
  _diagnosis: string;

  /**
   * Creates an instance of Diagnostic.
   * @param diagnostic - An object containing the properties of the diagnostic.
   */
  constructor(diagnostic: { id: number; price: number; vehicle_id: number; diagnosis: string; }) {
    this._id = diagnostic.id;
    this._price = diagnostic.price;
    this._vehicle_id = diagnostic.vehicle_id;
    this._diagnosis = diagnostic.diagnosis;
  }
  /* --- Getters & Setters --- */
  get id(): number { return this._id; }
  set id(id: number) { this._id = id; }
  get price(): number { return this._price; }
  set price(price: number) { this._price = price; }
  get vehicle_id(): number { return this._vehicle_id; }
  set vehicle_id(vehicle_id: number) { this._vehicle_id = vehicle_id; }
  get diagnosis(): string { return this._diagnosis; }
  set diagnosis(diagnosis: string) { this._diagnosis = diagnosis; }
}
