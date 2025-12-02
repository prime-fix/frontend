import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Visit} from '../domain/model/visit.entity';
import {VisitResource, VisitsResponse} from './visit-response';
import {formatDate} from '@angular/common';

/**
 * Assembler for converting between Visit entities and resources.
 */
export class VisitAssembler implements BaseAssembler<Visit, VisitResource, VisitsResponse>{
  /**
   * Converts a VisitsResponse to an array of Visit entities.
   * @param response - The Visits Response to convert.
   * @returns An array of Visit entities.
   */
  toEntitiesFromResponse(response: VisitsResponse): Visit[] {
    return response.visits.map(resource => this.toEntityFromResource(resource as VisitResource));
  }

  /**
   * Converts a Visit Resource to a Visit entity.
   * @param resource - The Visit Resource to convert.
   * @returns A Visit entity.
   */
  toEntityFromResource(resource: VisitResource): Visit {
    return new Visit({
      id: resource.id,
      failure: resource.failure,
      vehicle_id: resource.vehicle_id,
      time_visit: resource.time_visit,
      auto_repair_id: resource.auto_repair_id,
      service_id: resource.service_id,
    });
  }

  /**
   * Converts a Visit entity to a Visit Resource.
   * @param entity - The Visit entity to convert.
   * @returns A Visit Resource.
   */
  toResourceFromEntity(entity: Visit): VisitResource {
    return{
      id: entity.id,
      failure: entity.failure,
      vehicle_id: entity.vehicle_id,
      time_visit:  entity.time_visit ? formatDate(entity.time_visit, 'yyyy-MM-dd', 'en-US') : null,
      auto_repair_id: entity.auto_repair_id,
      service_id: entity.service_id,
    } as VisitResource;
  }

}
