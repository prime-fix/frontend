import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {ExpectedVisit} from '@catalog/domain/model/expected-visit.entity';
import {ExpectedVisitResource, ExpectedVisitResponse} from '@catalog/infrastructure/expected-visit-response';

export class ExpectedVisitAssembler implements BaseAssembler<ExpectedVisit, ExpectedVisitResource, ExpectedVisitResponse> {
  toEntitiesFromResponse(response: ExpectedVisitResponse): ExpectedVisit[] {
    return response.expectedVisits.map(resource => this.toEntityFromResource(resource as ExpectedVisitResource));
  }

  toEntityFromResource(resource: ExpectedVisitResource): ExpectedVisit {
    return new ExpectedVisit({
      id_expected: resource.id_expected,
      state_visit: resource.state_visit,
      id_visit: resource.id_visit,
      is_scheduled: resource.is_scheduled
    });
  }

  toResourceFromEntity(entity: ExpectedVisit): ExpectedVisitResource {
    return {
      id_expected: entity.id,
      state_visit: entity.state_visit,
      id_visit: entity.id_visit,
      is_scheduled: entity.is_scheduled
    } as ExpectedVisitResource;
  }

}
