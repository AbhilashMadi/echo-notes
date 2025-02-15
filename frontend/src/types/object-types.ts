import { ServerKeys } from "@/resources/serverkeys";

export type LoginFormSchema = {
  [ServerKeys.EMAIL]: string;
  [ServerKeys.PASSWORD]: string;
  [ServerKeys.REMEMBER]: boolean;
};

export type UserSchema = {
  [ServerKeys.EMAIL]: string;
  [ServerKeys.EMAIL_VERIFIED]: boolean;
  [ServerKeys.USERNAME]: string;
  [ServerKeys.CREATED_AT]: string;
  [ServerKeys.UPDATED_AT]: string;
};
