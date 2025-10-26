import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface VisitsResponse extends BaseResponse{
  visits:VisitResource[];
}
export interface VisitResource extends BaseResource{
  id_visit:number| string;
  failure:string;
  id_vehicle:number|string;
  time_visit:string;
  id_auto_repair:number|string;
  id_service:number|string;
  status:string
}
