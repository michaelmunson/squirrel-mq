// src/utils/utils.ts
var sql = (template, ...args) => {
  return template.map((t, i) => t + (args[i] ?? "")).join("");
};
export {
  sql
};
//# sourceMappingURL=index.js.map