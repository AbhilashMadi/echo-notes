export enum Paths {
  INDEX = "/",
  AUTH = "/auth/:form",
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
