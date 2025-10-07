import { BaseAssembler } from '@shared/infrastructure/http/base-assembler';
import { AutoRepairRegister } from '../domain/model/auto-repair-register.entity';
import { AutoRepairRegisterResource, AutoRepairRegisterResponse } from './auto-repair-register-response';

export class AutoRepairRegisterAssembler implements BaseAssembler<AutoRepairRegister, AutoRepairRegisterResource, AutoRepairRegisterResponse> {
  /**
   * Convierte un AutoRepairRegisterResponse en un arreglo de entidades AutoRepairRegister.
   * @param response - La respuesta de la API con los registros de talleres.
   * @returns Un arreglo de entidades AutoRepairRegister.
   */
  toEntitiesFromResponse(response: AutoRepairRegisterResponse): AutoRepairRegister[] {
    return response.autoRepairs.map(resource => this.toEntityFromResource(resource as AutoRepairRegisterResource));
  }

  /**
   * Convierte un AutoRepairRegisterResource en una entidad AutoRepairRegister.
   * @param resource - El recurso que se desea convertir.
   * @returns La entidad AutoRepairRegister convertida.
   */
  toEntityFromResource(resource: AutoRepairRegisterResource): AutoRepairRegister {
    return new AutoRepairRegister({
      id_auto_repair: resource.id_auto_repair,
      RUC: resource.RUC,
      contact_email: resource.contact_email,
      technicians_count: resource.technicians_count,
      id_location: resource.id_location
    });
  }

  /**
   * Convierte una entidad AutoRepairRegister en un recurso AutoRepairRegisterResource.
   * @param entity - La entidad que se desea convertir.
   * @returns El recurso AutoRepairRegisterResource convertido.
   */
  toResourceFromEntity(entity: AutoRepairRegister): AutoRepairRegisterResource {
    return {
      id_auto_repair: entity.id,
      RUC: entity.RUC,
      contact_email: entity.contact_email,
      technicians_count: entity.technicians_count,
      id_location: entity.id_location
    } as AutoRepairRegisterResource;
  }
}
