import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {UserAccount} from '@iam/domain/model/user-account.entity';
import {UserAccountResource, UserAccountResponse} from '@iam/infrastructure/api/user-account-response';

/**
 * Assembler for UserAccount entity and its corresponding resource representation.
 */
export class UserAccountAssembler implements BaseAssembler<UserAccount, UserAccountResource, UserAccountResponse> {
  /**
   * Converts a UserAccountResponse to an array of UserAccount entities.
   * @param response - The UserAccountResponse containing user account resources.
   * @returns An array of UserAccount entities.
   */
  toEntitiesFromResponse(response: UserAccountResponse): UserAccount[] {
    return response.user_accounts.map(resource => this.toEntityFromResource(resource as UserAccountResource));
  }

  /**
   * Converts a UserAccountResource to a UserAccount entity.
   * @param resource - The UserAccountResource to convert.
   * @returns A UserAccount entity.
   */
  toEntityFromResource(resource: UserAccountResource): UserAccount {
    return new UserAccount({
      id: resource.id,
      username: resource.username,
      email: resource.email,
      user_id: resource.user_id,
      role_id: resource.role_id,
      membership_id: resource.membership_id,
      password: resource.password,
      is_new: resource.is_new,
    })
  }

  /**
   * Converts a UserAccount entity to a UserAccountResource.
   * @param entity - The UserAccount entity to convert.
   * @returns A UserAccountResource.
   */
  toResourceFromEntity(entity: UserAccount): UserAccountResource {
    return {
      id: entity.id,
      username: entity.username,
      email: entity.email,
      user_id: entity.user_id,
      role_id: entity.role_id,
      membership_id: entity.membership_id,
      password: entity.password,
      is_new: entity.is_new,
    } as UserAccountResource;
  }

}
