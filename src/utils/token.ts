export let userToken = localStorage.getItem("token");

export const setUserToken = (val: string) => {
  userToken = val;
};
