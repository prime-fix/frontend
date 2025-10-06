import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {MainService} from '../domain/model/service.entity';
import {MaintenanceServiceResource, MaintenanceServiceResponse} from './service-response';

export class ServiceAssembler implements BaseAssembler<MainService, MaintenanceServiceResource, MaintenanceServiceResponse>{
  toEntitiesFromResponse(response: MaintenanceServiceResponse): MainService[] {
    return response.service.map(resource => this.toEntityFromResource(resource as MaintenanceServiceResource));
  }

  toEntityFromResource(resource: MaintenanceServiceResource): MainService {
    return new MainService({
      id_service: resource.id_service,
      name: resource.name,
      description: resource.description
    });
  }

  toResourceFromEntity(entity: MainService): MaintenanceServiceResource {
    return {
      id_service: entity.id,
      name: entity.name,
      description: entity.description
    }as MaintenanceServiceResource;
  }

}
