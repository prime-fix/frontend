import {BaseEntity} from '../../../shared/infrastructure/http/base-entity';
import {Location} from './location.entity';

export class AutoRepair implements BaseEntity{
  private _id: number;
  private _ruc: string;
  private _contactEmail: string;
  private _name: string;
  private _locationId: number;
  private _location: Location | null;
  private _rating: number;
  private _totalTechnicians: number;
  private _availableTechnicians: number;
  /**
   * Creates a new instance of the AutoRepair class.
   */
  constructor(autoRepair: {
    id: number;
    ruc: string;
    contactEmail: string;
    name: string;
    locationId: number;
    rating: number;
    totalTechnicians: number;
    availableTechnicians: number;
    location?: Location | null
  }) {
    this._id = autoRepair.id;
    this._ruc = autoRepair.ruc;
    this._contactEmail = autoRepair.contactEmail;
    this._name = autoRepair.name;
    this._locationId = autoRepair.locationId;
    this._location = autoRepair.location ?? null;
    this._rating = autoRepair.rating;
    this._totalTechnicians = autoRepair.totalTechnicians;
    this._availableTechnicians = autoRepair.availableTechnicians;
  }
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get ruc(): string { return this._ruc; }
  set ruc(value: string) { this._ruc = value; }
  get contactEmail(): string { return this._contactEmail; }
  set contactEmail(value: string) { this._contactEmail = value; }
  get name(): string { return this._name; }
  set name(value: string) { this._name = value; }
  get locationId(): number { return this._locationId; }
  set locationId(value: number) { this._locationId = value; }
  /**
   * The location associated with the auto repair.
   */
  get location(): Location | null { return this._location; }
  set location(value: Location | null) { this._location = value; }
  get rating(): number { return this._rating; }
  set rating(value: number) { this._rating = value; }
  get totalTechnicians(): number { return this._totalTechnicians; }
  set totalTechnicians(value: number) { this._totalTechnicians = value; }
  get availableTechnicians(): number { return this._availableTechnicians; }
  set availableTechnicians(value: number) { this._availableTechnicians = value; }
}
