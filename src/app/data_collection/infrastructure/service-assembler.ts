import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Service} from '../domain/model/service.entity';
import {MaintenanceServiceResource, MaintenanceServiceResponse} from './service-response';

/**
 * Assembler for converting between Service entities and resources.
 */
export class ServiceAssembler implements BaseAssembler<Service, MaintenanceServiceResource, MaintenanceServiceResponse>{
  /**
   * Converts a MaintenanceServiceResponse to an array of Service entities.
   * @param response - The Maintenance Service Response to convert.
   * @returns An array of Service entities.
   */
  toEntitiesFromResponse(response: MaintenanceServiceResponse): Service[] {
    return response.services.map(resource => this.toEntityFromResource(resource as MaintenanceServiceResource));
  }

  /**
   * Converts a Maintenance Service Resource to a Service entity.
   * @param resource - The Maintenance Service Resource to convert.
   * @returns A Service entity.
   */
  toEntityFromResource(resource: MaintenanceServiceResource): Service {
    return new Service({
      id: resource.id,
      name: resource.name,
      description: resource.description
    });
  }

  /**
   * Converts a Service entity to a Maintenance Service Resource.
   * @param entity - The Service entity to convert.
   * @returns A Maintenance Service Resource.
   */
  toResourceFromEntity(entity: Service): MaintenanceServiceResource {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description
    }as MaintenanceServiceResource;
  }

}
