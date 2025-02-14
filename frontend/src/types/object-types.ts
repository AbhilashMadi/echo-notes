import { ServerKeys } from "@/resources/serverkeys";

export type LoginFormSchema = {
  [ServerKeys.EMAIL]: string;
  [ServerKeys.PASSWORD]: string;
  [ServerKeys.REMEMBER]: boolean;
};
