import { BaseAssembler } from '@shared/infrastructure/http/base-assembler';
import {AutoRepair} from '@catalog/domain/model/auto-repair.entity';
import {AutoRepairResource, AutoRepairResponse} from './auto-repair-response';

/**
 * Assembler for converting between Auto Repair entities and resources.
 */
export class AutoRepairAssembler implements BaseAssembler<AutoRepair, AutoRepairResource, AutoRepairResponse> {

  /**
   * Converts an AutoRepairResponse to an array of AutoRepair entities.
   * @param response - The Auto Repair Response to convert.
   * @returns An array of Auto Repair entities.
   */
  toEntitiesFromResponse(response: AutoRepairResponse): AutoRepair[] {
    return response.autoRepairs.map(resource => this.toEntityFromResource(resource as AutoRepairResource));
  }

  /**
   * Converts an Auto Repair Resource to an AutoRepair entity.
   * @param resource - The Auto Repair Resource to convert.
   * @returns An Auto Repair entity.
   */
  toEntityFromResource(resource: AutoRepairResource): AutoRepair {
    return new AutoRepair({
      id_auto_repair: resource.id_auto_repair,
      ruc: resource.ruc,
      contact_email: resource.contact_email,
      technicians_count: resource.technicians_count,
      id_user_account: resource.id_user_account
    });
  }

  /**
   * Converts an Auto Repair entity to an Auto Repair Resource.
   * @param entity - The Auto Repair entity to convert.
   * @returns An Auto Repair Resource.
   */
  toResourceFromEntity(entity: AutoRepair): AutoRepairResource {
    return {
      id_auto_repair: entity.id,
      ruc: entity.ruc,
      contact_email: entity.contact_email,
      technicians_count: entity.technicians_count,
      id_user_account: entity.id_user_account
    } as AutoRepairResource;
  }
}
