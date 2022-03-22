export const queryStringToObject = (qstr: string): object => {
  const searchUrl = qstr.replace("?", "");
  const searchUrlArray = searchUrl.split("&");
  let obj = {};
  searchUrlArray.forEach((item: string) => {
    const key = item.split("=")[0];
    const value = item.split("=")[1];
    obj = { ...obj, [key]: value };
  });
  return obj;
};

export const createQueryStringFromObject = (obj: any = {}): string => {
  const qstr: string[] = [];
  const keys = Object.keys(obj);
  keys.forEach((key: string) => {
    if (obj[key] instanceof Array) {
      obj[key].map((arrayValue: any) => {
        qstr.push(`${key}=${arrayValue}`);
      });
    } else {
      qstr.push(`${key}=${obj[key]}`);
    }
  });
  return qstr.join("&").toString();
};
