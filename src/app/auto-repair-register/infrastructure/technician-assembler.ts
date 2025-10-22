import { BaseAssembler } from '@shared/infrastructure/http/base-assembler';
import { Technician } from '../domain/model/technician.entity';
import { TechnicianResource, TechnicianResponse } from './technician-response';

/**
 * Assembler class for converting between Technician entities and resources.
 */
export class TechnicianAssembler
  implements BaseAssembler<Technician, TechnicianResource, TechnicianResponse>
{
  /**
   * Converts a Technician Response to an array of Technician entities.
   * @param response - The response to convert.
   * @returns An array of converted Technician entities.
   */
  toEntitiesFromResponse(response: TechnicianResponse): Technician[] {
    return response.technicians.map(resource => this.toEntityFromResource(resource as TechnicianResource));
  }

  /**
   * Converts a Technician resource to a Technician entity.
   * @param resource - The resource to convert.
   * @returns The converted Technician entity.
   */
  toEntityFromResource(resource: TechnicianResource): Technician {
    return new Technician({
      id_technician: resource.id_technician,
      name: resource.name,
      last_name: resource.last_name,
      id_auto_repair: resource.id_auto_repair
    });
  }

  /**
   * Converts a Technician entity to a Technician resource.
   * @param entity - The entity to convert.
   * @returns The converted Technician resource.
   */
  toResourceFromEntity(entity: Technician): TechnicianResource {
    return {
      id_technician: entity.id,
      name: entity.name,
      last_name: entity.last_name,
      id_auto_repair: entity.id_auto_repair
    } as TechnicianResource;
  }
}
