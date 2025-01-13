interface NavItem {
  text: string;
  href: string;
}

export class NavChild {
  public render(items: NavItem[]): string {
    return items.map(item => `
      <li>
        <a href="${item.href}">${item.text}</a>
      </li>
    `).join('');
  }
}
