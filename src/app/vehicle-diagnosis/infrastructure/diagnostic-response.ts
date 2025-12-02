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
  id: number;
  /**
   * The price of the diagnostic.
   */
  price: number;
  /**
   * The vehicle ID associated with the diagnostic.
   */
  vehicle_id: number;
  /**
   * The diagnosis details.
   */
  diagnosis: string;
}
