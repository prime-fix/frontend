import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {User} from '@iam/domain/model/user.entity';
import {UserResource, UserResponse} from '@iam/infrastructure/api/user-response';


export class UserAssembler implements BaseAssembler<User, UserResource, UserResponse> {
  toEntitiesFromResponse(response: UserResponse): User[] {
    return response.users.map(resource => this.toEntityFromResource(resource as UserResource));
  }

  toEntityFromResource(resource: UserResource): User {
    return new User({
      id_user: resource.id_user,
      name: resource.name,
      last_name: resource.last_name,
      dni: resource.dni,
      phone_number: resource.phone_number,
      id_location: resource.id_location
    });
  }

  toResourceFromEntity(entity: User): UserResource {
    return {
      id_user: entity.id,
      name: entity.name,
      last_name: entity.last_name,
      dni: entity.dni,
      phone_number: entity.phone_number,
      id_location: entity.id_location
    } as UserResource;
  }

}
