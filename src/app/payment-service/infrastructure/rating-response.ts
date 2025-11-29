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
  id_rating: string;
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
  id_auto_repair: string;
  /**
   * Identifier for the user account that provided the rating.
   */
  id_user_account: string;
}
