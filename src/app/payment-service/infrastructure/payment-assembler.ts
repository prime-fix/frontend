import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Payment} from '../domain/model/payment.entity';
import {PaymentResource, PaymentResponse} from './payment-response';

/**
 * Assembler for Payment entities and resources.
 */
export class PaymentAssembler implements BaseAssembler<Payment, PaymentResource, PaymentResponse> {
  /**
   * Convert a PaymentResponse to an array of Payment entities.
   * @param response - The PaymentResponse to convert.
   * @returns An array of Payment entities.
   */
  toEntitiesFromResponse(response: PaymentResponse): Payment[] {
    return response.payments.map(resource => this.toEntityFromResource(resource as PaymentResource));
  }

  /**
   * Convert a PaymentResource to a Payment entity.
   * @param resource - The PaymentResource to convert.
   * @returns A Payment entity.
   */
  toEntityFromResource(resource: PaymentResource): Payment {
    return new Payment({
      id: resource.id,
      card_number: resource.card_number,
      card_type: resource.card_type,
      month: resource.month,
      year: resource.year,
      ccv: resource.ccv,
      user_account_id: resource.user_account_id
    })
  }

  /**
   * Convert a Payment entity to a PaymentResource.
   * @param entity - The Payment entity to convert.
   * @returns A PaymentResource.
   */
  toResourceFromEntity(entity: Payment): PaymentResource {
    return {
      id: entity.id,
      card_number: entity.card_number,
      card_type: entity.card_type,
      month: entity.month,
      year: entity.year,
      ccv: entity.ccv,
      user_account_id: entity.user_account_id
    } as PaymentResource;
  }
}
