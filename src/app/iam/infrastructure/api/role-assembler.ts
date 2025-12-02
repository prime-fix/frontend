import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Role} from '@iam/domain/model/role.entity';
import {RoleResource, RoleResponse} from '@iam/infrastructure/api/role-response';

/**
 * Assembler for Role entity, converting between Role, RoleResource, and RoleResponse.
 */
export class RoleAssembler implements BaseAssembler<Role, RoleResource, RoleResponse> {
  /**
   * Convert a RoleResponse to an array of Role entities.
   * @param response - The RoleResponse object containing role resources.
   * @returns An array of Role entities.
   */
  toEntitiesFromResponse(response: RoleResponse): Role[] {
    return response.roles.map(resource => this.toEntityFromResource(resource as RoleResource));
  }

  /**
   * Convert a RoleResource to a Role entity.
   * @param resource - The RoleResource object.
   * @returns A Role entity.
   */
  toEntityFromResource(resource: RoleResource): Role {
    return new Role({
      id: resource.id,
      name: resource.name,
    });
  }

  /**
   * Convert a Role entity to a RoleResource.
   * @param entity - The Role entity.
   * @returns A RoleResource object.
   */
  toResourceFromEntity(entity: Role): RoleResource {
    return {
      id: entity.id,
      name: entity.name,
    } as RoleResource;
  }
}
