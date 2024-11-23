export default (artifacts: Record<string, unknown>, str: string) => {
  const regex = /\{\{(.*?)\}\}/;
  const variables = str.split(regex);
  let tempStr = str;
  for (const variable of variables) {
    tempStr = tempStr.replace(
      `{{${variable}}}`,
      String(artifacts[variable]) ?? `{{${variable}}}`,
    );
  }
  return tempStr;
};
