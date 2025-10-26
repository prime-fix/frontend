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
      id_visit: resource.id_visit,
      failure: resource.failure,
      id_vehicle: resource.id_vehicle,
      time_visit: resource.time_visit,
      id_auto_repair: resource.id_auto_repair,
      id_service: resource.id_service,
      status: resource.status
    });
  }

  /**
   * Converts a Visit entity to a Visit Resource.
   * @param entity - The Visit entity to convert.
   * @returns A Visit Resource.
   */
  toResourceFromEntity(entity: Visit): VisitResource {
    return{
      id_visit: entity.id,
      failure: entity.failure,
      id_vehicle: entity.id_vehicle,
      time_visit:  entity.time_visit ? formatDate(entity.time_visit, 'yyyy-MM-dd', 'en-US') : null,
      id_auto_repair: entity.id_auto_repair,
      id_service: entity.id_service,
      status: entity.status
    } as VisitResource;
  }

}
