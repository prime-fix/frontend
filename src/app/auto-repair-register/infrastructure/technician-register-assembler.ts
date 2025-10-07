import { BaseAssembler } from '@shared/infrastructure/http/base-assembler';
import { TechnicianRegister } from '../domain/model/technician-register.entity';
import { TechnicianRegisterResource, TechnicianRegisterResponse } from './technician-register-response';

/**
 * Assembler for converting between TechnicianRegister entities and API resources/responses.
 */
export class TechnicianRegisterAssembler
  implements BaseAssembler<TechnicianRegister, TechnicianRegisterResource, TechnicianRegisterResponse>
{
  /**
   * Converts a TechnicianRegisterResponse to an array of TechnicianRegister entities.
   * @param response - The API response containing a list of technicians.
   * @returns An array of TechnicianRegister entities.
   */
  toEntitiesFromResponse(response: TechnicianRegisterResponse): TechnicianRegister[] {
    return response.technicians.map(resource => this.toEntityFromResource(resource as TechnicianRegisterResource));
  }

  /**
   * Converts a TechnicianRegisterResource to a TechnicianRegister entity.
   * @param resource - The resource to convert.
   * @returns The converted TechnicianRegister entity.
   */
  toEntityFromResource(resource: TechnicianRegisterResource): TechnicianRegister {
    return new TechnicianRegister({
      id_technician: resource.id_technician,
      name: resource.name,
      age: resource.age,
      id_user_account: resource.id_user_account,
      id_auto_repair: resource.id_auto_repair
    });
  }

  /**
   * Converts a TechnicianRegister entity to a TechnicianRegisterResource.
   * @param entity - The entity to convert.
   * @returns The converted TechnicianRegisterResource.
   */
  toResourceFromEntity(entity: TechnicianRegister): TechnicianRegisterResource {
    return {
      id_technician: entity.id,
      name: entity.name,
      age: entity.age,
      id_user_account: entity.id_user_account,
      id_auto_repair: entity.id_auto_repair
    } as TechnicianRegisterResource;
  }
}
