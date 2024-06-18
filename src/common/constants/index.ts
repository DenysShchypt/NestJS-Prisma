export const USER_SELECT_FIELDS = {
  wallet: true,
  email: true,
  name: true,
  id: true,
};
export const USER_UPDATE_FIELDS = {
  wallet: true,
  email: true,
  name: true,
};

export const APP_USER_FIELDS = {
  ...USER_SELECT_FIELDS,
  password: true,
};
