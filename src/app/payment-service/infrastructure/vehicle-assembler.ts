import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleResource, VehicleResponse} from './vehicle-response';

/**
 * Assembler for Vehicle entities and resources.
 */
export class VehicleAssembler implements BaseAssembler<Vehicle, VehicleResource, VehicleResponse>{
  /**
   * Convert a VehicleResponse to an array of Vehicle entities.
   * @param response - The VehicleResponse to convert.
   * @returns An array of Vehicle entities.
   */
  toEntitiesFromResponse(response: VehicleResponse): Vehicle[] {
    return response.vehicles.map(resource => this.toEntityFromResource(resource as VehicleResource));
  }

  /**
   * Convert a VehicleResource to a Vehicle entity.
   * @param resource - The VehicleResource to convert.
   * @returns A Vehicle entity.
   */
  toEntityFromResource(resource: VehicleResource): Vehicle {
    return new Vehicle({
      id_vehicle: resource.id_vehicle,
      model: resource.model,
      id_user: resource.id_user,
      vehicle_brand: resource.vehicle_brand,
      vehicle_plate: resource.vehicle_plate,
      vehicle_type: resource.vehicle_type,
      color: resource.color
    })
  }

  /**
   * Convert a Vehicle entity to a VehicleResource.
   * @param entity - The Vehicle entity to convert.
   * @returns A VehicleResource.
   */
  toResourceFromEntity(entity: Vehicle): VehicleResource {
    return {
      id_vehicle: entity.id,
      model: entity.model,
      id_user: entity.id_user,
      vehicle_brand: entity.vehicle_brand,
      vehicle_plate: entity.vehicle_plate,
      vehicle_type: entity.vehicle_type,
      color: entity.color
    } as VehicleResource;
  }
}
