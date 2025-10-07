import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface LocationResponse extends BaseResponse{
  locations: LocationResource[];
}

export interface LocationResource extends BaseResource {
  id_location: string;
  address: string;
  district: string;
  department: string;
}
