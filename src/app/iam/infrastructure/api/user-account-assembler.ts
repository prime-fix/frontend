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
      id_user_account: resource.id_user_account,
      username: resource.username,
      email: resource.email,
      id_user: resource.id_user,
      id_role: resource.id_role,
      id_membership: resource.id_membership,
      password: resource.password
    })
  }

  /**
   * Converts a UserAccount entity to a UserAccountResource.
   * @param entity - The UserAccount entity to convert.
   * @returns A UserAccountResource.
   */
  toResourceFromEntity(entity: UserAccount): UserAccountResource {
    return {
      id_user_account: entity.id,
      username: entity.username,
      email: entity.email,
      id_user: entity.id_user,
      id_role: entity.id_role,
      id_membership: entity.id_membership,
      password: entity.password
    } as UserAccountResource;
  }

}
