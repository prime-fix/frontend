import { BaseAssembler } from '../../shared/infrastructure/http/base-assembler';
import { Location } from '../domain/model/location.entity';
import { LocationResource, LocationsResponse } from './locations-response';

export class LocationAssembler implements BaseAssembler<Location, LocationResource, LocationsResponse> {
  /**
   * Converts a LocationsResponse to an array of Location entities.
   */
  toEntitiesFromResponse(response: LocationsResponse): Location[] {
    return response.locations.map(resource => this.toEntityFromResource(resource as LocationResource));
  }
  /**
   * Converts a LocationResource to a Location entity.
   */
  toEntityFromResource(resource: LocationResource): Location {
    return new Location({
      id: resource.id,
      address: resource.address,
      district: resource.district,
      department: resource.department
    });
  }
  /**
   * Converts a Location entity to a LocationResource.
   */
  toResourceFromEntity(entity: Location): LocationResource {
    return {
      id: entity.id,
      address: entity.address,
      district: entity.district,
      department: entity.department
    } as LocationResource;
  }
}
