import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {ExpectedVisit} from '@diagnosis/domain/model/expected-visit.entity';
import {ExpectedVisitResource, ExpectedVisitResponse} from '@diagnosis/infrastructure/expected-visit-response';

/**
 * Assembler for converting between ExpectedVisit entities and their corresponding resources and responses.
 */
export class ExpectedVisitAssembler implements BaseAssembler<ExpectedVisit, ExpectedVisitResource, ExpectedVisitResponse> {
  /**
   * Converts an ExpectedVisitResponse to an array of ExpectedVisit entities.
   * @param response - The ExpectedVisitResponse to convert.
   * @returns An array of ExpectedVisit entities.
   */
  toEntitiesFromResponse(response: ExpectedVisitResponse): ExpectedVisit[] {
    return response.expectedVisits.map(resource => this.toEntityFromResource(resource as ExpectedVisitResource));
  }

  /**
   * Converts an ExpectedVisitResource to an ExpectedVisit entity.
   * @param resource - The ExpectedVisitResource to convert.
   * @returns An ExpectedVisit entity.
   */
  toEntityFromResource(resource: ExpectedVisitResource): ExpectedVisit {
    return new ExpectedVisit({
      id: resource.id,
      state_visit: resource.state_visit,
      visit_id: resource.visit_id,
      is_scheduled: resource.is_scheduled,
      vehicle_id: resource.vehicle_id
    });
  }

  /**
   * Converts an ExpectedVisit entity to an ExpectedVisitResource.
   * @param entity - The ExpectedVisit entity to convert.
   * @returns An ExpectedVisitResource.
   */
  toResourceFromEntity(entity: ExpectedVisit): ExpectedVisitResource {
    return {
      id: entity.id,
      state_visit: entity.state_visit,
      visit_id: entity.visit_id,
      is_scheduled: entity.is_scheduled,
      vehicle_id: entity.vehicle_id
    } as ExpectedVisitResource;
  }

}
