export class RightType {
  id: number;
  name: string;
}

export class User {
  id: number;
  name: string;
  email: string;
  secret: string;
  comment: string;
  rightTypeId: number;
  rightType: RightType;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersPage {
  items: User[];
  total_count: number;
}

