import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface PaymentResponse extends BaseResponse {
    payments: PaymentResource[];
}

export interface PaymentResource extends BaseResource {
  id_payment: string;
  card_number: number;
  card_type: string;
  month: number;
  year: number;
  cvv: number;
  id_user_account: string;
}
