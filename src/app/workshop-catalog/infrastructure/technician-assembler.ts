import { BaseAssembler } from '../../shared/infrastructure/http/base-assembler';
import { Technician } from '../domain/model/technician.entity';
import { TechnicianResource, TechniciansResponse } from './technicians-response';

export class TechnicianAssembler implements BaseAssembler<Technician, TechnicianResource, TechniciansResponse> {
  /**
   * Converts a TechniciansResponse to an array of Technician entities.
   */
  toEntitiesFromResponse(response: TechniciansResponse): Technician[] {
    console.log(response);
    return response.technicians.map(resource => this.toEntityFromResource(resource as TechnicianResource));
  }

  /**
   * Converts a TechnicianResource to a Technician entity.
   */
  toEntityFromResource(resource: TechnicianResource): Technician {
    return new Technician({
      id: resource.id,
      name: resource.name,
      age: resource.age,
      autoRepairId: resource.autoRepairId,
      available: resource.available
    });
  }

  /**
   * Converts a Technician entity to a TechnicianResource.
   */
  toResourceFromEntity(entity: Technician): TechnicianResource {
    return {
      id: entity.id,
      name: entity.name,
      age: entity.age,
      autoRepairId: entity.autoRepairId,
      available: entity.available
    } as TechnicianResource;
  }
}
