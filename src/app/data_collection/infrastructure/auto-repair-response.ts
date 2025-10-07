import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface RepairResponse extends BaseResponse{
  auto_repairs: BaseResource[];
}

export interface RepairResource extends BaseResource{
  id_auto_repair: number|string;
  RUC: string;
  contact_email: string;
  technician_count: number;
}
