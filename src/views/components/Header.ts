import { NavChild } from "./NavChild";
import { IcLogo } from "../../resources/assets/icons/index.js";
import { listNav, listNavIcon } from "@/constants/header.js";

export default class Header {

  public static render(): string {
    return `
      <header id="rootApp">
        <div class="header--logo">
          <figure>
            <a href="/home"> <img class="logo" src="${IcLogo}" alt="logo"> </a>
          </figure>
        </div>
        <div class="header--nav">
          <ul>${NavChild.render(listNav)}</ul>
          <ul>${NavChild.render(listNavIcon)}</ul>
        </div>
      </header>
    `;
  }
}
