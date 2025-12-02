import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for Location resources.
 */
export interface LocationResponse extends BaseResponse{
  locations: LocationResource[];
}

/**
 * Resource interface for Location entity.
 */
export interface LocationResource extends BaseResource {
  id: number;
  address: string;
  district: string;
  department: string;
}
