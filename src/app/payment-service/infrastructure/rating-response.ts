import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for rating-related API responses.
 */
export interface RatingResponse extends BaseResponse{
  ratings: RatingResource[];
}

/**
 * Resource interface representing a rating entity.
 */
export interface RatingResource extends BaseResource {
  id_rating: string;
  star_rating: number;
  comment: string;
  id_auto_repair: string;
  id_user_account: string;
}
