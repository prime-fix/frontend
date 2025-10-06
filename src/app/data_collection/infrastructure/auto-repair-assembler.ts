import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Repair} from '../domain/model/auto-repair.entity';
import {AutoRepairResponse, RepairResource} from './auto-repair-response';

export class AutoRepairAssembler implements BaseAssembler<Repair, RepairResource, AutoRepairResponse>{
  toEntitiesFromResponse(response: AutoRepairResponse): Repair[] {
    return response.auto_repairs.map(resource => this.toEntityFromResource(resource as RepairResource));
  }

  toEntityFromResource(resource: RepairResource): Repair {
    return new Repair({
      id: resource.id,
      RUC: resource.RUC,
      contact_email: resource.contact_email,
      technician_count: resource.technician_count
    });
  }

  toResourceFromEntity(entity: Repair): RepairResource {
    return {
      id: entity.id,
      RUC: entity.RUC,
      contact_email: entity.contact_email,
      technician_count: entity.technician_count
    };
  }

}
