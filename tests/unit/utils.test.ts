import { describe, it, expect } from "@jest/globals";
import { camelToSnakeCase, getUrl, snakeToCamelCase } from "../../src/utils";

describe('utils', () => {
  it('should convert camelCase to snake_case', () => {
    expect(camelToSnakeCase('camelCase')).toBe('camel_case');
  });

  it('should convert snake_case to camelCase', () => {
    expect(snakeToCamelCase('snake_case')).toBe('snakeCase');
  });

  it('should get url', () => {
    expect(getUrl('http://localhost:3000/', '/api/', '/users/', '/1/')).toBe('http://localhost:3000/api/users/1');
    expect(getUrl('http://localhost:3000/', '/api/', '/users/', '/1/', '/')).toBe('http://localhost:3000/api/users/1');
    expect(getUrl('http://localhost:3000/', 'api', 'users', '1', '')).toBe('http://localhost:3000/api/users/1');
    expect(getUrl('http://localhost:3000/', '')).toBe('http://localhost:3000');
  });
});
