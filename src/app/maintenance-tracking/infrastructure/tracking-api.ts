import {BaseApi} from '@shared/infrastructure/http/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Notification} from '@tracking/domain/model/notification.entity';
import {NotificationApiEndpoint} from '@tracking/infrastructure/notification-api-endpoint';
import {Injectable} from '@angular/core';
import {VehicleApiEndpoint} from '@tracking/infrastructure/vehicle-api-endpoint';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';

/**
 * API service for managing tracking-related operations such as notifications and vehicles.
 */
@Injectable({
  providedIn: 'root'
})
export class TrackingApi extends BaseApi {
  /**
   * The notifications API endpoint.
   * @private - Indicates that this property is private and should not be accessed directly from outside the class.
   */
  private readonly notificationsEndpoint: NotificationApiEndpoint;
  /**
   * The VehicleApiEndpoint instance for managing vehicles.
   * @private
   */
  private readonly vehicleEndpoint:     VehicleApiEndpoint;

  /**
   * Constructs a new instance of the TrackingApi.
   * @param http - The HttpClient used for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super();
    this.notificationsEndpoint = new NotificationApiEndpoint(http);
    this.vehicleEndpoint = new VehicleApiEndpoint(http);
  }

  /**
   * Fetches all notifications.
   * @returns An observable that emits an array of notifications.
   */
  getNotifications(): Observable<Notification[]> {
    return this.notificationsEndpoint.getAll();
  }

  /**
   * Fetches a notification by its ID.
   * @param id - The ID of the notification to fetch.
   * @returns An observable that emits the notification with the specified ID.
   */
  getNotification(id: number): Observable<Notification> {
    return this.notificationsEndpoint.getById(id);
  }

  /**
   * Creates a new notification.
   * @param notification - The notification to create.
   * @returns An observable that emits the created notification.
   */
  createNotification(notification: Notification): Observable<Notification> {
    return this.notificationsEndpoint.create(notification);
  }

  /**
   * Updates an existing notification.
   * @param notification - The notification to update.
   * @returns An observable that emits the updated notification.
   */
  updateNotification(notification: Notification): Observable<Notification> {
    return this.notificationsEndpoint.update(notification, notification.id);
  }

  /**
   * Deletes a notification by its ID.
   * @param id - The ID of the notification to delete.
   * @returns An observable that completes when the notification is deleted.
   */
  deleteNotification(id: number): Observable<void> {
    return this.notificationsEndpoint.delete(id);
  }

  /**
   * Gets all Vehicles.
   * @returns An Observable of an array of Vehicles.
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.vehicleEndpoint.getAll();
  }

  /**
   * Gets a Vehicle by its ID.
   * @param id - The ID of the Vehicle.
   * @returns An Observable of the Vehicle.
   */
  getVehicleById(id: number): Observable<Vehicle> {
    return this.vehicleEndpoint.getById(id);
  }

  /**
   * Creates a new Vehicle.
   * @param vehicle - The Vehicle to create.
   * @returns An Observable of the created Vehicle.
   */
  createVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehicleEndpoint.create(vehicle);
  }

  /**
   * Updates an existing Vehicle.
   * @param vehicle - The Vehicle to update.
   * @returns An Observable of the updated Vehicle.
   */
  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    return this.vehicleEndpoint.update(vehicle, vehicle.id);
  }

  /**
   * Deletes a Vehicle by its ID.
   * @param id - The ID of the Vehicle to delete.
   * @returns An Observable of void.
   */
  deleteVehicle(id: number): Observable<void> {
    return this.vehicleEndpoint.delete(id);
  }
}
