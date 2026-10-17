/** Allowed lucide icon names. Mapped to components in components/Icon.tsx. */
export const ICON_NAMES = [
  'sparkles',
  'cpu',
  'brain',
  'layers',
  'workflow',
  'flask-conical',
  'users',
  'rocket',
  'gauge',
  'target',
  'terminal',
  'shield-check',
  'graduation-cap',
  'search',
] as const

export type IconName = (typeof ICON_NAMES)[number]

export const iconOptions = ICON_NAMES.map((name) => ({ title: name, value: name }))
