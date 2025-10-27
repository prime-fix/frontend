import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Diagnostic} from '@diagnosis/domain/model/diagnostic.entity';
import {DiagnosticResource, DiagnosticResponse} from '@diagnosis/infrastructure/diagnostic-response';
import {DiagnosticAssembler} from '@diagnosis/infrastructure/diagnostic-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing diagnostics.
 */
export class DiagnosticsApiEndpoint extends BaseApiEndpoint<Diagnostic, DiagnosticResource, DiagnosticResponse, DiagnosticAssembler> {
  /**
   * The key used for the diagnostic ID in query parameters.
   * @protected
   * @readonly
   */
  protected readonly idQueryParamKey = environment.diagnosticIdQueryParamKey;

  /**
   * Constructor for DiagnosticsApiEndpoint.
   * @param http - The HttpClient instance for making HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixDiagnosticsEndpointPath}`,
      new DiagnosticAssembler(), { usePathParams: environment.usePathParams });
  }
}
