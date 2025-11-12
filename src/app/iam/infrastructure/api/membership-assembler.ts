import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Membership} from '@iam/domain/model/membership.entity';
import {MembershipResource, MembershipResponse} from '@iam/infrastructure/api/membership-response';

/**
 * Assembler for Membership entity, converting between Membership, MembershipResource, and MembershipResponse.
 */
export class MembershipAssembler implements BaseAssembler<Membership, MembershipResource, MembershipResponse> {
  /**
   * Convert a MembershipResponse to an array of Membership entities.
   * @param response - The MembershipResponse object containing membership resources.
   * @returns An array of Membership entities.
   */
  toEntitiesFromResponse(response: MembershipResponse): Membership[] {
    return response.memberships.map(resource => this.toEntityFromResource(resource as MembershipResource));
  }

  /**
   * Convert a MembershipResource to a Membership entity.
   * @param resource - The MembershipResource object.
   * @returns A Membership entity.
   */
  toEntityFromResource(resource: MembershipResource): Membership {
    return new Membership({
      id_membership: resource.id_membership,
      description: resource.description,
      started: resource.started,
      over: resource.over
    });
  }

  /**
   * Convert a Membership entity to a MembershipResource.
   * @param entity - The Membership entity.
   * @returns A MembershipResource object.
   */
  toResourceFromEntity(entity: Membership): MembershipResource {
    return {
      id_membership: entity.id,
      description: entity.description,
      started: entity.started,
      over: entity.over
    } as MembershipResource;
  }
}
