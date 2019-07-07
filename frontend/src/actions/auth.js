export const AUTH_SUCCESS = "AUTH_SUCCESS";
export const LOGOUT = "LOGOUT";

export const authenticate = () => async dispatch => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    // const { user } = await AuthService.authenticate();
    // dispatch({ type: AUTH_SUCCESS, user });
  } catch (err) {
    localStorage.removeItem("token");
  }
};
