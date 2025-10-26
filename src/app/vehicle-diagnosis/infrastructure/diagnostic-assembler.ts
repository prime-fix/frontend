import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Diagnostic} from '@diagnosis/domain/model/diagnostic.entity';
import {DiagnosticResource, DiagnosticResponse} from '@diagnosis/infrastructure/diagnostic-response';

export class DiagnosticAssembler implements BaseAssembler<Diagnostic, DiagnosticResource, DiagnosticResponse> {
  toEntitiesFromResponse(response: DiagnosticResponse): Diagnostic[] {
    return response.diagnostics.map(resource => this.toEntityFromResource(resource as DiagnosticResource));
  }

  toEntityFromResource(resource: DiagnosticResource): Diagnostic {
    return new Diagnostic({
      id_diagnostic: resource.id_diagnostic,
      price: resource.price,
      id_vehicle: resource.id_vehicle,
      state_diagnostic: resource.state_diagnostic,
      diagnosis: resource.diagnosis,
      id_expected: resource.id_expected
    });
  }

  toResourceFromEntity(entity: Diagnostic): DiagnosticResource {
    return {
      id_diagnostic:  entity.id,
      price: entity.price,
      id_vehicle: entity.id_vehicle,
      state_diagnostic: entity.state_diagnostic,
      diagnosis: entity.diagnosis,
      id_expected: entity.id_expected
    } as DiagnosticResource;
  }

}
