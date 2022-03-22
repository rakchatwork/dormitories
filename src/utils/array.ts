export const remove_duplicates_es6 = (arr: any[]) => {
  const s: any = new Set(arr);
  const it: any = s.values();
  return Array.from(it);
};
