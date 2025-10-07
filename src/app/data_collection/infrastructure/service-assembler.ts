import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Service} from '../domain/model/service.entity';
import {MaintenanceServiceResource, MaintenanceServiceResponse} from './service-response';

export class ServiceAssembler implements BaseAssembler<Service, MaintenanceServiceResource, MaintenanceServiceResponse>{
  toEntitiesFromResponse(response: MaintenanceServiceResponse): Service[] {
    return response.service.map(resource => this.toEntityFromResource(resource as MaintenanceServiceResource));
  }

  toEntityFromResource(resource: MaintenanceServiceResource): Service {
    return new Service({
      id_service: resource.id_service,
      name: resource.name,
      description: resource.description
    });
  }

  toResourceFromEntity(entity: Service): MaintenanceServiceResource {
    return {
      id_service: entity.id,
      name: entity.name,
      description: entity.description
    }as MaintenanceServiceResource;
  }

}
