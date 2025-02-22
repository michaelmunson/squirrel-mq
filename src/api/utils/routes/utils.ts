export const getBetweenCurlyBraces = (value:string) => {
  let stack = 1;
  const startValue = value.slice(value.indexOf('(') + 1);
  for (let i = 0; i < startValue.length; i++) {
    if (startValue[i] === '{') {
      stack++;
    }
    else if (startValue[i] === '}') {
      stack--;
    }
    if (stack === 0) {
      return startValue.slice(0, i);
    }
  }
  return value;
}
