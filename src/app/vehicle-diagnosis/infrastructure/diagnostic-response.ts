import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represent the API response for Diagnostics
 */
export interface DiagnosticResponse extends BaseResponse {
  /**
   * Array of Diagnostic resources.
   */
  diagnostics: DiagnosticResource[];
}

/**
 * Represent the API resource for a Diagnostic
 */
export interface DiagnosticResource extends BaseResource {
  /**
   * The unique identifier of the diagnostic.
   */
  id_diagnostic: string;
  /**
   * The price of the diagnostic.
   */
  price: number;
  /**
   * The vehicle ID associated with the diagnostic.
   */
  id_vehicle: string;
  /**
   * The state of the diagnostic.
   */
  state_diagnostic: string;
  /**
   * The diagnosis details.
   */
  diagnosis: string;
  /**
   * The expected ID associated with the diagnostic.
   */
  id_expected: string;
}
