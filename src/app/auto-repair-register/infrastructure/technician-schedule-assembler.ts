import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {TechnicianSchedule} from '@register/domain/model/technician-schedule.entity';
import {
  TechnicianScheduleResource,
  TechnicianScheduleResponse
} from '@register/infrastructure/technician-schedule-response';

/**
 * Assembler class for converting between Technician Schedule entities and resources.
 */
export class TechnicianScheduleAssembler implements BaseAssembler<TechnicianSchedule, TechnicianScheduleResource, TechnicianScheduleResponse> {
  /**
   * Converts a Technician Schedule Response to an array of Technician Schedule entities.
   * @param response - The response to convert.
   * @returns An array of converted Technician Schedule entities.
   */
  toEntitiesFromResponse(response: TechnicianScheduleResponse): TechnicianSchedule[] {
    return response.technicianSchedules.map(resource => this.toEntityFromResource(resource as TechnicianScheduleResource));
  }

  /**
   * Converts a Technician Schedule resource to a Technician Schedule entity.
   * @param resource - The resource to convert.
   * @returns The converted Technician Schedule entity.
   */
  toEntityFromResource(resource: TechnicianScheduleResource): TechnicianSchedule {
    return new TechnicianSchedule({
      id_schedule: resource.id_schedule,
      id_technician: resource.id_technician,
      day_of_week: resource.day_of_week,
      start_time: resource.start_time,
      end_time: resource.end_time,
      is_active: resource.is_active
    });
  }

  /**
   * Converts a Technician Schedule entity to a Technician Schedule resource.
   * @param entity - The entity to convert.
   * @returns The converted Technician Schedule resource.
   */
  toResourceFromEntity(entity: TechnicianSchedule): TechnicianScheduleResource {
    return {
      id_schedule: entity.id,
      id_technician: entity.id_technician,
      day_of_week: entity.day_of_week,
      start_time: entity.start_time,
      end_time:  entity.end_time,
      is_active: entity.is_active
    } as TechnicianScheduleResource;
  }

}
