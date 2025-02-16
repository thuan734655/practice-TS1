import { IcLogout } from "@/resources/assets/icons";
import { NavItem } from "@/types/componentTypes";
import { getDataLocalStorage } from "@/utils/localStorage";

export const listNav: NavItem[] = [
    { text: "Home", href: "/home" },
    { text: "Movies", href: "/movies" },
    { text: "TV Shows", href: "/tvshows" },
    { text: "Add", href: `/add/${getDataLocalStorage("name")}` },
  ];

export const listNavIcon: NavItem[] = [
    {
      text: `<figure><img src="${IcLogout}" alt="logout"/><figcaption>Logout</figcaption></figure>`,
      href: "/login",
    },
  ];