import isInDOM from './is-in-dom';

export default function hasParent(element: any, root: HTMLElement) {
  return root && root.contains(element) && isInDOM(element);
}
