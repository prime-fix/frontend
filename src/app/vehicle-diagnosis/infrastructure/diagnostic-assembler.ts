import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Diagnostic} from '@diagnosis/domain/model/diagnostic.entity';
import {DiagnosticResource, DiagnosticResponse} from '@diagnosis/infrastructure/diagnostic-response';

/**
 * Assembler class for converting between Diagnostic entities and resources.
 */
export class DiagnosticAssembler implements BaseAssembler<Diagnostic, DiagnosticResource, DiagnosticResponse> {
  /**
   * Converts a DiagnosticResponse to an array of Diagnostic entities.
   * @param response - The DiagnosticResponse to convert.
   * @returns An array of Diagnostic entities.
   */
  toEntitiesFromResponse(response: DiagnosticResponse): Diagnostic[] {
    return response.diagnostics.map(resource => this.toEntityFromResource(resource as DiagnosticResource));
  }

  /**
   * Converts a DiagnosticResource to a Diagnostic entity.
   * @param resource - The DiagnosticResource to convert.
   * @returns A Diagnostic entity.
   */
  toEntityFromResource(resource: DiagnosticResource): Diagnostic {
    return new Diagnostic({
      id: resource.id,
      price: resource.price,
      vehicle_id: resource.vehicle_id,
      diagnosis: resource.diagnosis,
    });
  }

  /**
   * Converts a Diagnostic entity to a DiagnosticResource.
   * @param entity - The Diagnostic entity to convert.
   * @returns A DiagnosticResource.
   */
  toResourceFromEntity(entity: Diagnostic): DiagnosticResource {
    return {
      id:  entity.id,
      price: entity.price,
      vehicle_id: entity.vehicle_id,
      diagnosis: entity.diagnosis,
    } as DiagnosticResource;
  }

}
