export default function isInDOM(obj: HTMLElement) {
  return Boolean(obj.closest('body'));
}
