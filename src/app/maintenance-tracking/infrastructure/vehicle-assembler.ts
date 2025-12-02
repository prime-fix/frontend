import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Vehicle} from '@tracking/domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from './vehicle-response';

/**
 * Assembler for converting between Vehicle entities and resources.
 */
export class VehicleAssembler implements BaseAssembler<Vehicle, VehicleResource, VehiclesResponse> {
  /**
   * Converts a VehiclesResponse to an array of Vehicle entities.
   * @param response - The Vehicles Response to convert.
   * @returns An array of Vehicle entities.
   */
  toEntitiesFromResponse(response: VehiclesResponse): Vehicle[] {
    return response.vehicles.map(resource => this.toEntityFromResource(resource as VehicleResource));
  }

  /**
   * Converts a Vehicle Resource to a Vehicle entity.
   * @param resource - The Vehicle Resource to convert.
   * @returns A Vehicle entity.
   */
  toEntityFromResource(resource: VehicleResource): Vehicle {
    return new Vehicle({
      id: resource.id,
      color: resource.color,
      model: resource.model,
      user_id: resource.user_id,
      vehicle_brand: resource.vehicle_brand,
      vehicle_plate: resource.vehicle_plate,
      vehicle_type: resource.vehicle_type,
      state_maintenance: resource.state_maintenance
    })
  }

  /**
   * Converts a Vehicle entity to a Vehicle Resource.
   * @param entity - The Vehicle entity to convert.
   * @returns A Vehicle Resource.
   */
  toResourceFromEntity(entity: Vehicle): VehicleResource {
    return {
      id: entity.id,
      color: entity.color,
      model: entity.model,
      user_id: entity.user_id,
      vehicle_brand: entity.vehicle_brand,
      vehicle_plate: entity.vehicle_plate,
      vehicle_type: entity.vehicle_type,
      state_maintenance: entity.state_maintenance
    } as VehicleResource;
  }
}
