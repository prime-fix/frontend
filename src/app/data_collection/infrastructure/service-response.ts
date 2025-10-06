import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface MaintenanceServiceResponse extends BaseResponse{

  service:MaintenanceServiceResource[];
}

export interface MaintenanceServiceResource extends BaseResource{
  id_service:number;
  name:string;
  description:string;
}
