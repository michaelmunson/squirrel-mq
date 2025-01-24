export const sql = (template: TemplateStringsArray, ...args: any[]) => {
  return template.map((t, i) => t + (args[i] ?? '')).join('')
}
