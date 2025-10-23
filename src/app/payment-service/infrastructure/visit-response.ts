import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for visit-related API responses.
 */
export interface VisitResponse extends BaseResponse{
  visits: VisitResource[];
}

/**
 * Resource interface representing a visit entity.
 */
export interface VisitResource extends BaseResource{
  id_visit: string;
  failure: string;
  time_visit: string;
  id_auto_repair: string;
  id_service: string;
  status: string;
  id_vehicle: string;
}
