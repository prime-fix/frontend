import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Visit} from '../domain/model/visit.entity';
import {VisitResource, VisitsResponse} from './visit-response';

export class VisitAssembler implements BaseAssembler<Visit, VisitResource, VisitsResponse>{
  toEntitiesFromResponse(response: VisitsResponse): Visit[] {
    return response.visits.map(resource => this.toEntityFromResource(resource as VisitResource));
  }

  toEntityFromResource(resource: VisitResource): Visit {
    return new Visit({
      id: resource.id,
      failure: resource.failure,
      id_vehicle: resource.id_vehicle,
      time_visit: resource.time_visit,
      id_auto_repair: resource.id_auto_repair,
      id_service: resource.id_service,
      status: resource.status
    });
  }

  toResourceFromEntity(entity: Visit): VisitResource {
    return{
      id: entity.id,
      failure: entity.failure,
      id_vehicle: entity.id_vehicle,
      time_visit: entity.time_visit,
      id_auto_repair: entity.id_auto_repair,
      id_service: entity.id_service,
      status: entity.status
    } as VisitResource;
  }

}
