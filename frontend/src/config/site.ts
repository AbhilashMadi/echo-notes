export enum Paths {
  // Auth Routes
  INDEX = "/",
  AUTH = "/auth/:form",
  LOGIN = "/auth/login",
  SIGNUP = "/auth/signup",
  OTP = "/auth/otp",

  // Private Routes
  NOTE = "/note/:id",
  DASHBOARD = "/dashboard",

  // Public Routes
  NOT_FOUND = "/not-found",
}

export const siteConfig = {
  name: "Echo Notes",
  description: "",
  navItems: [],
  navMenuItems: [],
  links: {
    github: "",
    twitter: "",
    docs: "",
    discord: "",
    sponsor: "",
  },
};

export type SiteConfig = typeof siteConfig;
