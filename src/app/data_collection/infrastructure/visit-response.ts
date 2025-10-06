import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface VisitsResponse extends BaseResponse{
  visits:VisitResource[];
}
export interface VisitResource extends BaseResource{
  id:number;
  failure:string;
  id_vehicle:number;
  time_visit:string;
  id_auto_repair:number;
  id_service:number
  status:string
}
