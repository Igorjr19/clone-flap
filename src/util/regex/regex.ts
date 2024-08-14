export const checkRegex = (regex: string, input: string) => {
  const re = new RegExp(regex);
  return re.test(input);
};
