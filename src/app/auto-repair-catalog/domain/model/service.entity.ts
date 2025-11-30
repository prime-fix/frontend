import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Service entity.
 */
export class Service implements BaseEntity {
  /**
   * The unique identifier for the service.
   */
   _id_service: string;
  /**
   * The name of the service.
   */
  _name: string;
  /**
   * The description of the service.
   */
   _description: string;

  /**
   * Creates an instance of Service.
   * @param {Object} service - An object containing the properties of the service.
   * @property {number} service.id_service - The unique identifier for the service.
   * @property {string} service.name - The name of the service.
   * @property {string} service.description - The description of the service.
   */
  constructor(service: { id_service: string; name: string; description: string }) {
    this._id_service = service.id_service;
    this._name = service.name;
    this._description = service.description;
  }

  /* --- Getters & Setters --- */
  get id(): string {return this._id_service;}
  get name(): string {return this._name;}
  get description(): string {return this._description;}
  set id(value: string) {this._id_service = value;}
  set name(value: string) {this._name = value;}
  set description(value: string) {this._description = value;}
}
