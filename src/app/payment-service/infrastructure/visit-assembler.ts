import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Visit} from '../domain/model/visit.entity';
import {VisitResource, VisitResponse} from './visit-response';

/**
 * Assembler for Visit entities and resources.
 */
export class VisitAssembler implements BaseAssembler<Visit, VisitResource, VisitResponse>{
  /**
   * Convert a VisitResponse to an array of Visit entities.
   * @param response - The VisitResponse to convert.
   * @returns An array of Visit entities.
   */
  toEntitiesFromResponse(response: VisitResponse): Visit[] {
    return response.visits.map(resource => this.toEntityFromResource(resource as VisitResource));
  }

  /**
   * Convert a VisitResource to a Visit entity.
   * @param resource - The VisitResource to convert.
   * @returns A Visit entity.
   */
  toEntityFromResource(resource: VisitResource): Visit {
    return new Visit({
      id_visit: resource.id_visit,
      failure: resource.failure,
      time_visit: resource.time_visit,
      id_auto_repair: resource.id_auto_repair,
      id_service: resource.id_service,
      status: resource.status,
      id_vehicle: resource.id_vehicle,
    })
  }

  /**
   * Convert a Visit entity to a VisitResource.
   * @param entity - The Visit entity to convert.
   * @returns A VisitResource.
   */
  toResourceFromEntity(entity: Visit): VisitResource {
    return {
      id_visit: entity.id,
      failure: entity.failure,
      time_visit: entity.time_visit,
      id_auto_repair: entity.id_auto_repair,
      id_service: entity.id_service,
      status: entity.status,
      id_vehicle: entity.id_vehicle,
    } as VisitResource;
  }
}
