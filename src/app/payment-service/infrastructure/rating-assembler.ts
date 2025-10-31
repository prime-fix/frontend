import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Rating} from '../domain/model/rating.entity'
import {RatingResource, RatingResponse} from './rating-response';

/**
 * Assembler for Rating entities and resources.
 */
export class RatingAssembler implements BaseAssembler<Rating, RatingResource, RatingResponse>{
  /**
   * Convert a RatingResponse to an array of Rating entities.
   * @param response - The RatingResponse to convert.
   * @returns An array of Rating entities.
   */
  toEntitiesFromResponse(response: RatingResponse): Rating[] {
    return response.ratings.map(resource => this.toEntityFromResource(resource as RatingResource));
  }

  /**
   * Convert a RatingResource to a Rating entity.
   * @param resource - The RatingResource to convert.
   * @returns A Rating entity.
   */
  toEntityFromResource(resource: RatingResource): Rating {
    return new Rating({
      id_rating: resource.id_rating,
      star_rating: resource.star_rating,
      comment: resource.comment,
      time_rating: resource.time_rating,
      id_auto_repair: resource.id_auto_repair,
      id_user_account: resource.id_user_account,
    })
  }

  /**
   * Convert a Rating entity to a RatingResource.
   * @param entity - The Rating entity to convert.
   * @returns A RatingResource.
   */
  toResourceFromEntity(entity: Rating): RatingResource {
    return {
      id_rating: entity.id,
      star_rating: entity.star_rating,
      comment: entity.comment,
      time_rating: entity.time_rating,
      id_auto_repair: entity.id_auto_repair,
      id_user_account: entity.id_user_account,
    } as RatingResource;
  }
}
