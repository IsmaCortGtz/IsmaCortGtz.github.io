/**
 * Generates a CSS-safe custom identifier for View Transitions.
 * Strips or converts spaces, plus signs, and other characters that are invalid in CSS <custom-ident>.
 *
 * Example:
 *   toTransitionName("skill-icon", "C++") => "skill-icon-c-plus-plus"
 *   toTransitionName("skill-icon", "React Native") => "skill-icon-react-native"
 */
export function toTransitionName(prefix: string, name: string): string {
  const safeName = name
    .toLowerCase()
    .trim()
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${prefix}-${safeName}`;
}
