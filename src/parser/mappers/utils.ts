export const getTextContent = (
  element: Element,
  tagName: string,
): string | undefined => {
  const child = element.querySelector(tagName);
  return child?.textContent?.trim() || undefined;
};

export const parseNumberContent = (
  element: Element,
  tagName: string,
): number | undefined => {
  const textContent = getTextContent(element, tagName);
  if (textContent === undefined) return undefined;
  const num = parseInt(textContent, 10);
  return isNaN(num) ? undefined : num;
};

export const parseFloatContent = (
  element: Element,
  tagName: string,
): number | undefined => {
  const textContent = getTextContent(element, tagName);
  if (textContent === undefined) return undefined;
  const num = parseFloat(textContent);
  return isNaN(num) ? undefined : num;
};

export const getAttribute = (
  element: Element,
  attributeName: string,
): string | undefined => {
  return element.getAttribute(attributeName) || undefined;
};

export const parseOptionalNumberAttribute = (
  element: Element,
  attributeName: string,
): number | undefined => {
  const value = element.getAttribute(attributeName);
  if (value === null) {
    return undefined;
  }
  const num = parseInt(value, 10);
  return isNaN(num) ? undefined : num;
};
