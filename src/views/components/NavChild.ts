import { NavItem } from "../../types/basePageTypes";

export class NavChild {
  public static render(items: NavItem[]): string {
    return items.map(item => `
      <li>
        <a href="${item.href}">${item.text}</a>
      </li>
    `).join('');
  }
}
