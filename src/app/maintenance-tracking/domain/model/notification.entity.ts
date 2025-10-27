import {BaseEntity} from '@shared/infrastructure/http/base-entity';

/**
 * Represents a Notification entity.
 */
export class Notification implements BaseEntity {
  /**
   * Identifier for the notification
   */
  _id_notification: string;
  /**
   * Message content of the notification
   */
  _message: string;
  /**
   * Read status of the notification
   */
  _read: boolean;
  /**
   * Identifier for the associated vehicle
   */
  _id_vehicle: string;
  /**
   * Date when the notification was sent
   */
  _sent: Date;
  /**
   * Identifier for the associated diagnostic
   */
  _id_diagnostic: string;

  /**
   * Constructor
   * @param {Object} notification - Notification data
   * @property {string} notification.id_notification - Notification ID
   * @property {string} notification.message - Notification message
   * @property {boolean} notification.read - Read status
   * @property {string} notification.id_vehicle - Vehicle ID
   * @property {Date} notification.sent - Sent date
   * @property {string} notification.id_diagnostic - Diagnostic ID
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
