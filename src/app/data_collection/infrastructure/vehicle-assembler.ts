import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from './vehicle-response';


export class VehicleAssembler implements BaseAssembler<Vehicle, VehicleResource, VehiclesResponse> {

  toEntitiesFromResponse(response: VehiclesResponse): Vehicle[] {
    return response.vehicles.map(resource => this.toEntityFromResource(resource as VehicleResource));
  }

  toEntityFromResource(resource: VehicleResource): Vehicle {
    return new Vehicle({
      id_vehicle: resource.id_vehicle,
      color: resource.color,
      model: resource.model,
      id_user: resource.id_user,
      vehicle_brand: resource.vehicle_brand,
      vehicle_plate: resource.vehicle_plate,
      vehicle_type: resource.vehicle_type
    })
  }

  toResourceFromEntity(entity: Vehicle): VehicleResource {
    return {
      id_vehicle: entity.id,
      color: entity.color,
      model: entity.model,
      id_user: entity.id_user,
      vehicle_brand: entity.vehicle_brand,
      vehicle_plate: entity.vehicle_plate,
      vehicle_type: entity.vehicle_type
    } as VehicleResource;
  }
}
