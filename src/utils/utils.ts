export const isObject = (value:any) => typeof value === 'object' && value?.toString() === '[object Object]';

export const sql = (template: TemplateStringsArray, ...args: any[]) => {
  return template.map((t, i) => t + (args[i] ?? '')).join('')
}

export const snakeToCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export const camelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export const convertRecordKeysToCamelCase = (obj: Record<string, any>, ignoreKeys: string[] = []): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(o => convertRecordKeysToCamelCase(o, ignoreKeys));
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    ignoreKeys.includes(key) ? key : snakeToCamelCase(key),
    value?.toString() === '[object Object]' ? convertRecordKeysToCamelCase(value, ignoreKeys) : value
  ]));
}

export const convertRecordKeysToSnakeCase = (obj: Record<string, any>, ignoreKeys: string[] = []): Record<string, any> => {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(o => convertRecordKeysToSnakeCase(o, ignoreKeys));
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [
    ignoreKeys.includes(key) ? key : camelToSnakeCase(key),
    value?.toString() === '[object Object]' ? convertRecordKeysToSnakeCase(value, ignoreKeys) : value
  ]));
}

export const mergeDeep = (target: any, source: any) => {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}