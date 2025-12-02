import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Payment} from '../domain/model/payment.entity';
import {PaymentResource, PaymentResponse} from './payment-response';
import {PaymentAssembler} from './payment-assembler';
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
    super(
      http,
      `${environment.primeFixProviderApiBaseUrlAWS}${environment.primeFixProviderPaymentsEndpointPath}`,
      new PaymentAssembler(),
      {
        usePathParams: environment.usePathParams,
        enableFallback: true,
        primaryBaseUrl: environment.primeFixProviderApiBaseUrlAWS,
        fallbackBaseUrl: environment.primeFixProviderApiBaseUrlSupabase
      }
    );
  }
}
