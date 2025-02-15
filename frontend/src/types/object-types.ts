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
  [ServerKeys.TAGS]: string[];
};

export type NoteSchema = {
  [ServerKeys.USER_ID]: string;
  [ServerKeys.TITLE]: string;
  [ServerKeys.CONTENT]: string;
  [ServerKeys.IMAGES]: string[];
  [ServerKeys.FAVORITE]: boolean;
  [ServerKeys.PINNED]: boolean;
  [ServerKeys.TAGS]: string[];
  [ServerKeys.CREATED_AT]: Date;
  [ServerKeys.UPDATED_AT]: Date;
};
