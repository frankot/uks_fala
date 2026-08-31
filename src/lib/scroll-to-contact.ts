export const CONTACT_ID = "kontakt";
export const CONTACT_FORM_ID = "kontakt-form";

/** Navbar height (72px) plus its top offset and a little breathing room. */
const NAV_OFFSET = 96;
/** Below this the contact card stacks, so the form sits under the copy column. */
const TWO_COLUMN_MIN_WIDTH = 1024;

/**
 * The contact card is taller than the viewport, so a plain `#kontakt` anchor jump
 * stops with most of the form still below the fold. This measures the target and
 * centres it when it fits, otherwise pins its top just under the navbar.
 *
 * On the two-column desktop layout the form is beside the copy, so we position the
 * form itself; on stacked layouts we use the whole card so the phone and e-mail
 * details are not scrolled past.
 */
export function scrollToContact(behavior: ScrollBehavior = "smooth"): boolean {
  const card = document.getElementById(CONTACT_ID);
  if (!card) return false;

  const form =
    window.innerWidth >= TWO_COLUMN_MIN_WIDTH
      ? document.getElementById(CONTACT_FORM_ID)
      : null;
  const target = form ?? card;

  const rect = target.getBoundingClientRect();
  const targetTop = rect.top + window.scrollY;
  const available = window.innerHeight - NAV_OFFSET;
  const offset =
    rect.height < available
      ? NAV_OFFSET + (available - rect.height) / 2
      : NAV_OFFSET;

  window.scrollTo({ top: Math.max(0, targetTop - offset), behavior });
  return true;
}
