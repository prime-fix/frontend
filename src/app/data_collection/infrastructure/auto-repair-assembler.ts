import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Repair} from '../domain/model/auto-repair.entity';
import {RepairResponse, RepairResource} from './auto-repair-response';

export class AutoRepairAssembler implements BaseAssembler<Repair, RepairResource, RepairResponse>{
  toEntitiesFromResponse(response: RepairResponse): Repair[] {
    return response.auto_repairs.map(resource => this.toEntityFromResource(resource as RepairResource));
  }

  toEntityFromResource(resource: RepairResource): Repair {
    return new Repair({
      id_auto_repair: resource.id_auto_repair,
      RUC: resource.RUC,
      contact_email: resource.contact_email,
      technician_count: resource.technician_count
    });
  }

  toResourceFromEntity(entity: Repair): RepairResource {
    return {
      id_auto_repair: entity.id,
      RUC: entity.RUC,
      contact_email: entity.contact_email,
      technician_count: entity.technician_count
    } as RepairResource;
  }

}
