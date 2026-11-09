Venuo Admin Dashboard — Color Theme
Theme direction
Charcoal Black + Warm Ivory + Champagne Gold

A premium, modern dark theme for the Venuo admin dashboard. The interface should feel polished and trustworthy while remaining comfortable for long sessions managing venues, bookings, users, payments, and reports.
Core color palette
Role	Color name	Hex
Main app background	Deep Charcoal	#111111
Sidebar	Charcoal Black	#171717
Cards and elevated surfaces	Soft Charcoal	#222222
Primary text	Warm Ivory	#F5F2EB
Secondary text	Muted Gray	#A3A3A3
Borders and dividers	Graphite	#353535
Primary accent	Champagne Gold	#D6B77A


Usage guidelines
Backgrounds and surfaces
- Use #111111 for the main application background.
- Use #171717 for the sidebar and navigation areas.
- Use #222222 for cards, tables, dropdowns, and modal surfaces.
- Use #353535 for subtle borders and separators.
Text
- Use #F5F2EB for page titles, important labels, and primary content.
- Use #A3A3A3 for descriptions, helper text, timestamps, and secondary information.
- Avoid low-contrast gray text on dark surfaces.
Accent and actions
- Use #D6B77A for selected navigation indicators, key highlights, chart emphasis, and important calls to action.
- Use champagne gold sparingly. Do not use it for large backgrounds or every button.
- Check text contrast when placing text on gold. Prefer a dark text color such as #171717 on gold buttons.
Status colors
Use semantic colors consistently and keep them visually restrained.
Status	Suggested color	Hex
Success / Approved	Soft Green	#65A982
Pending / Warning	Warm Amber	#D9A441
Rejected / Error	Soft Red	#D16B6B
Informational	Muted Blue	#78A6D0


For status badges, use a subtle tinted background with readable text rather than a fully saturated block of color.
Component recommendations
- Sidebar: charcoal background, ivory labels, muted gray inactive icons, gold active indicator.
- Header: match the main surface; keep borders subtle.
- Stat cards: soft charcoal surface, ivory values, muted labels, restrained gold highlights.
- Tables: soft charcoal surface, clear row separators, readable hover and selected states.
- Primary button: champagne gold background with charcoal text.
- Secondary button: transparent or charcoal background with a graphite border.
- Inputs: dark surface, graphite border, ivory text, clear focus ring.
- Charts: use a restrained palette; reserve gold for the primary series and use muted supporting colors.
Design principles
1. Prefer charcoal shades over pure black for layered surfaces.
2. Maintain clear contrast between the page, sidebar, cards, and overlays.
3. Use gold as an accent, not as the dominant color.
4. Keep spacing, typography, and component states consistent.
5. Ensure hover, focus, disabled, loading, success, and error states are visible.
6. Test tables, charts, and forms with realistic data before finalizing the theme.
7. Keep the design practical for frequent admin tasks, not only visually impressive.
CSS variables
:root {
  color-scheme: dark;

  --color-background: #111111;
  --color-sidebar: #171717;
  --color-surface: #222222;
  --color-text-primary: #F5F2EB;
  --color-text-secondary: #A3A3A3;
  --color-border: #353535;
  --color-accent: #D6B77A;

  --color-success: #65A982;
  --color-warning: #D9A441;
  --color-error: #D16B6B;
  --color-info: #78A6D0;
}
Final direction
Use Charcoal Black + Warm Ivory + Champagne Gold as the Venuo Admin default theme. The goal is a premium dark interface that stays readable, consistent, and functional across dashboard analytics, venue approvals, booking management, user management, and settings.