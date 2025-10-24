import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Payment} from '@iam/domain/model/payment.entity';
import {PaymentResource, PaymentResponse} from '@iam/infrastructure/api/payment-response';
import {PaymentAssembler} from '@iam/infrastructure/api/payment-assembler';
import {environment} from '@env/environment';
import {HttpClient} from '@angular/common/http';

/**
 * API endpoint for managing Payment entities.
 */
export class PaymentApiEndpoint extends BaseApiEndpoint<Payment, PaymentResource, PaymentResponse, PaymentAssembler> {
  /**
   * Key for the payment ID query parameter.
   * @protected
   */
  protected readonly idQueryParamKey: string = environment.paymentIdQueryParamKey;

  /**
   * Constructor for PaymentApiEndpoint.
   * @param http - The HttpClient instance to use for HTTP requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.primeFixProviderApiBaseUrl}${environment.primeFixProviderPaymentsEndpointPath}`,
      new PaymentAssembler(), { usePathParams: environment.usePathParams });
  }
}
