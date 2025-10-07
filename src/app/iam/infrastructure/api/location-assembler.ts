import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Location} from '@iam/domain/model/location.entity';
import {LocationResource, LocationResponse} from '@iam/infrastructure/api/location-response';

export class LocationAssembler implements BaseAssembler<Location, LocationResource, LocationResponse> {
  toEntitiesFromResponse(response: LocationResponse): Location[] {
    return response.locations.map(resource => this.toEntityFromResource(resource as LocationResource));
  }

  toEntityFromResource(resource: LocationResource): Location {
    return new Location({
      id_location: resource.id_location,
      address: resource.address,
      district: resource.district,
      department: resource.department
    })
  }

  toResourceFromEntity(entity: Location): LocationResource {
    return {
      id_location: entity.id,
      address: entity.address,
      district: entity.district,
      department: entity.department
    } as LocationResource;
  }
}
