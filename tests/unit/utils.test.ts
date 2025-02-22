import { describe, it, expect } from "@jest/globals";
import { camelToSnakeCase, snakeToCamelCase } from "../../src/utils";

describe('utils', () => {
  it('should convert camelCase to snake_case', () => {
    expect(camelToSnakeCase('camelCase')).toBe('camel_case');
  });

  it('should convert snake_case to camelCase', () => {
    expect(snakeToCamelCase('snake_case')).toBe('snakeCase');
  });
});
