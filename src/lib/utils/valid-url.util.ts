export const isValidUrl = (str: string | undefined): boolean => {
  try {
    if (str) {
      new URL(str);
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};
