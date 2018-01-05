/**
 * Hooks that match up to methods in the Personalization system,
 * that need to exist on the Soho object for backwards-compatibility reasons.
 * These exported functions end up on the Soho object during the bootstrapping process.
 * TODO: make this not the preferred way of accessing these methods, and instead prefer access to the global `Personalize`
 */
import { personalization } from './personalize.bootstrap';

export function setTheme(theme) {
  return personalization.setTheme(theme);
}

export function setColors(colors) {
  return personalization.setColors(colors);
}

export function getColorStyleSheet(colors) {
  return personalization.getColorStyleSheet(colors);
}
