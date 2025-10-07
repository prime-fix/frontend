import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Payment} from '@iam/domain/model/payment.entity';
import {PaymentResource, PaymentResponse} from '@iam/infrastructure/api/payment-response';

export class PaymentAssembler implements BaseAssembler<Payment, PaymentResource, PaymentResponse> {
  toEntitiesFromResponse(response: PaymentResponse): Payment[] {
    return response.payments.map(resource => this.toEntityFromResource(resource as PaymentResource));
  }

  toEntityFromResource(resource: PaymentResource): Payment {
    return new Payment({
      id_payment: resource.id_payment,
      card_number: resource.card_number,
      card_type: resource.card_type,
      month: resource.month,
      year: resource.year,
      cvv: resource.cvv,
      id_user_account: resource.id_user_account
    })
  }

  toResourceFromEntity(entity: Payment): PaymentResource {
    return {
      id_payment: entity.id,
      card_number: entity.card_number,
      card_type: entity.card_type,
      month: entity.month,
      year: entity.year,
      cvv: entity.cvv,
      id_user_account: entity.id_user_account
    } as PaymentResource;
  }
}
