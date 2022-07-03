import type { User } from '$lib/shared/api/users';

export interface ConnectionMetadata {
  tutor: User;
  tutee: User;
  classDuration: number;
}
