import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for payment-related API responses.
 */
export interface PaymentResponse extends BaseResponse {
  payments: PaymentResource[];
}

/**
 * Resource interface representing a payment entity.
 */
export interface PaymentResource extends BaseResource {
  id: number;
  card_number: number;
  card_type: string;
  month: number;
  year: number;
  cvv: number;
  user_account_id: number;
}
