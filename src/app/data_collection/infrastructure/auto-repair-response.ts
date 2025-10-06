import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

export interface AutoRepairResponse extends BaseResponse{
  auto_repairs: BaseResource[];
}

export interface RepairResource extends BaseResource{
  id: number;
  RUC: string;
  contact_email: string;
  technician_count: number;
}
