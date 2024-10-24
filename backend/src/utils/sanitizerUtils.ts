export const pick = <T extends Record<string, unknown>, U extends keyof T>(obj: T, keys: Array<U>): Pick<T, U> => {
  const ret = Object.create(null);
  for (const k of keys) {
    ret[k] = obj[k];
  }
  return ret;
};

export const pickCollection = <T extends Record<string, unknown>, U extends keyof T>(
  array: T[],
  keys: Array<U>,
): Pick<T, U>[] => {
  const result: Pick<T, U>[] = [];
  for (const obj of array) {
    result.push(pick(obj, keys));
  }
  return result;
};
