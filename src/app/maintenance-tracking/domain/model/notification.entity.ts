import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Notification entity.
 */
export class Notification implements BaseEntity {
  /**
   * Identifier for the notification
   */
  _id: number;
  /**
   * Message content of the notification
   */
  _message: string;
  /**
   * Read status of the notification
   */
  _read: boolean;
  /**
   * Date when the notification was sent
   */
  _sent: Date;
  /**
   * Identifier for the associated vehicle
   */
  _vehicle_id: number;

  /**
   * Creates an instance of Notification.
   * @param notification - An object containing the properties of the notification.
   */
  constructor(notification: { id: number; message: string; read: boolean; sent: Date; vehicle_id: number; }) {
    this._id = notification.id;
    this._message = notification.message;
    this._read = notification.read;
    this._sent = notification.sent;
    this._vehicle_id = notification.vehicle_id;
  }

  /**
   * Getters and Setters
   */
  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }
  get message(): string { return this._message; }
  set message(value: string) { this._message = value; }
  get read(): boolean { return this._read; }
  set read(value: boolean) { this._read = value; }
  get sent(): Date { return this._sent; }
  set sent(value: Date) { this._sent = value; }
  get vehicle_id(): number { return this._vehicle_id; }
  set vehicle_id(value: number) { this._vehicle_id = value; }
}
