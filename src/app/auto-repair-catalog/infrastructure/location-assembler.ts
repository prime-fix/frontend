import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Location} from '@catalog/domain/model/location.entity';
import {LocationResource, LocationResponse} from '@catalog/infrastructure/location-response';

/**
 * Assembler for Location entities and resources.
 */
export class LocationAssembler implements BaseAssembler<Location, LocationResource, LocationResponse> {
  /**
   * Convert a LocationResponse to an array of Location entities.
   * @param response - The LocationResponse to convert.
   * @return An array of Location entities.
   */
  toEntitiesFromResponse(response: LocationResponse): Location[] {
    return response.locations.map(resource => this.toEntityFromResource(resource as LocationResource));
  }

  /**
   * Convert a LocationResource to a Location entity.
   * @param resource - The LocationResource to convert.
   * @return A Location entity.
   */
  toEntityFromResource(resource: LocationResource): Location {
    return new Location({
      id_location: resource.id_location,
      address: resource.address,
      district: resource.district,
      department: resource.department
    })
  }

  /**
   * Convert a Location entity to a LocationResource.
   * @param entity - The Location entity to convert.
   * @return A LocationResource.
   */
  toResourceFromEntity(entity: Location): LocationResource {
    return {
      id_location: entity.id,
      address: entity.address,
      district: entity.district,
      department: entity.department
    } as LocationResource;
  }
}
