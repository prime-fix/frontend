import { BaseAssembler } from '../../shared/infrastructure/http/base-assembler';
import { AutoRepair } from '../domain/model/auto-repair.entity';
import { AutoRepairResource, AutoRepairsResponse } from './auto-repairs-response';

export class AutoRepairAssembler implements BaseAssembler<AutoRepair, AutoRepairResource, AutoRepairsResponse> {
  /**
   * Converts an AutoRepairsResponse to an array of AutoRepair entities.
   */
  toEntitiesFromResponse(response: AutoRepairsResponse): AutoRepair[] {
    console.log(response);
    return response.autoRepairs.map(resource => this.toEntityFromResource(resource as AutoRepairResource));
  }

  /**
   * Converts an AutoRepairResource to a AutoRepair entity.
   */
  toEntityFromResource(resource: AutoRepairResource): AutoRepair {
    return new AutoRepair({
      id: resource.id,
      ruc: resource.ruc,
      contactEmail: resource.contactEmail,
      name: resource.name,
      locationId: resource.locationId,
      rating: resource.rating,
      totalTechnicians: resource.totalTechnicians,
      availableTechnicians: resource.availableTechnicians
    });
  }

  /**
   * Converts an AutoRepair entity to a AutoRepairResource.
   */
  toResourceFromEntity(entity: AutoRepair): AutoRepairResource {
    return {
      id: entity.id,
      ruc: entity.ruc,
      contactEmail: entity.contactEmail,
      name: entity.name,
      locationId: entity.locationId,
      rating: entity.rating,
      totalTechnicians: entity.totalTechnicians,
      availableTechnicians: entity.availableTechnicians
    } as AutoRepairResource;
  }
}
