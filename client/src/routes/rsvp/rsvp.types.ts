export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  groupId?: number;
  rsvpStatus: "PENDING" | "ACCEPTED" | "DECLINED";
  canBringPlusOne: boolean;
  dietaryRestrictions?: string;
  createdAt: Date;
  plusOne?: PlusOne;
}

export interface PlusOne {
  id: number;
  name: string;
  userId: number;
}
