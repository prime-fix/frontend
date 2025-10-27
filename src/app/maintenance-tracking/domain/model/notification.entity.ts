import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Notification Entity
 */
export class Notification implements BaseEntity {
  _id_notification: string;
  _message: string;
  _read: boolean;
  _id_vehicle: string;
  _sent: Date;
  _id_diagnostic: string;

  /**
   * Constructor
   * @param notification - Notification data
   * {id_notification: string, message: string, read: boolean, id_vehicle: string, sent: Date}
   */
  constructor(notification: { id_notification: string; message: string; read: boolean; id_vehicle: string; sent: Date; id_diagnostic: string; }) {
    this._id_notification = notification.id_notification;
    this._message = notification.message;
    this._read = notification.read;
    this._id_vehicle = notification.id_vehicle;
    this._sent = notification.sent;
    this._id_diagnostic = notification.id_diagnostic;
  }

  /**
   * Getters and Setters
   */
  get id(): string { return this._id_notification; }
  set id(value: string) { this._id_notification = value; }
  get message(): string { return this._message; }
  set message(value: string) { this._message = value; }
  get read(): boolean { return this._read; }
  set read(value: boolean) { this._read = value; }
  get id_vehicle(): string { return this._id_vehicle; }
  set id_vehicle(value: string) { this._id_vehicle = value; }
  get sent(): Date { return this._sent; }
  set sent(value: Date) { this._sent = value; }
  get id_diagnostic(): string { return this._id_diagnostic; }
  set id_diagnostic(value: string) { this._id_diagnostic = value; }
}
