import {StatusVehicle} from '../domain/model/status-vehicle.entity';
import {StatusVehicleResponse, StatusVehicleResource} from './status-vehicle-response';
import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';

export class StatusVehicleAssembler implements BaseAssembler<StatusVehicle, StatusVehicleResource, StatusVehicleResponse> {
  /**
   * Converts a StatusVehicleResponse to an array of StatusVehicle entities.
   * @param response - The API response containing categories.
   * @returns An array of StatusVehicle entities.
   */
  toEntitiesFromResponse(response: StatusVehicleResponse): StatusVehicle[] {
    return response.categories.map(resource => this.toEntityFromResource(resource as StatusVehicleResource));
  }

  /**
   * Converts a StatusVehicleResource to a StatusVehicle entity.
   * @param resource - The resource to convert.
   * @returns The converted StatusVehicle entity.
   */
  toEntityFromResource(resource: StatusVehicleResource): StatusVehicle {
    return new StatusVehicle({
      id: resource.id,
      vehicle: resource.vehicle,
      license_plate: resource.license_plate,
      owner: resource.owner,
      status: resource.status,
      diagnostic: resource.diagnostic,
      price: resource.price
    });
  }

  /**
   * Converts a StatusVehicle entity to a StatusVehicleResource.
   * @param entity - The entity to convert.
   * @returns The converted StatusVehicleResource.
   */
  toResourceFromEntity(entity: StatusVehicle): StatusVehicleResource {
    return {
      id: entity.id,
      vehicle: entity.vehicle,
      license_plate: entity.license_plate,
      owner: entity.owner,
      status: entity.status,
      diagnostic: entity.diagnostic,
      price: entity.price
    } as StatusVehicleResource;
  }
}
