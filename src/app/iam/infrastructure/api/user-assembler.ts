import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/api/user-response';

/**
 * Assembler for User entity, converting between User, UserResource, and UserResponse.
 */
export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  /**
   * Convert a UserResponse to an array of User entities.
   * @param response - The UserResponse object containing user resources.
   * @returns An array of User entities.
   */
  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(resource => this.toEntityFromResource(resource as UserResource));
  }

  /**
   * Convert a UserResource to a User entity.
   * @param resource - The UserResource object.
   * @returns A User entity.
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      name: resource.name,
      last_name: resource.last_name,
      dni: resource.dni,
      phone_number: resource.phone_number,
      location_id: resource.location_id
    });
  }

  /**
   * Convert a User entity to a UserResource.
   * @param entity - The User entity.
   * @returns A UserResource object.
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      name: entity.name,
      last_name: entity.last_name,
      dni: entity.dni,
      phone_number: entity.phone_number,
      location_id: entity.location_id
    } as UserResource;
  }

}
