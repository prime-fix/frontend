import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Response interface for rating-related API responses.
 */
export interface RatingResponse extends BaseResponse{
  /**
   * Array of rating resources.
   */
  ratings: RatingResource[];
}

/**
 * Resource interface representing a rating entity.
 */
export interface RatingResource extends BaseResource {
  /**
   * Unique identifier for the rating.
   */
  id: number;
  /**
   * Star rating given by the user.
   */
  star_rating: number;
  /**
   * Comment provided by the user.
   */
  comment: string;
  /**
   * Timestamp of when the rating was created.
   */
  time_rating: string;
  /**
   * Identifier for the associated auto repair service.
   */
  auto_repair_id: number;
  /**
   * Identifier for the user account that provided the rating.
   */
  user_account_id: number;
}
