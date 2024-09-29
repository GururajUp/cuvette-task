import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const registerUser = async (userName, password) => {
  try {
    console.log("userName,password: ", userName, password);
    const response = await axios.post(`${BACKEND_URL}/auth/register`, {
      userName,
      password,
    });
    console.log(response);
    return response; 
  } catch (error) {
    console.log("ERROR : ", error);
    return { data: error };
  }
};

export const loginUser = async (userName, password) => {
  try {
    console.log("userName,password: ", userName, password);
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      userName,
      password,
    });
    const token = await response.data.token;
    const userId = await response.data.id;
    const loggedInUsername = await response.data.userName;

    console.log("LOGIN USER DATA :", response);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    localStorage.setItem("token",token);
    localStorage.setItem("userId",userId);
    localStorage.setItem("userName",loggedInUsername);

    return response;
  } catch (error) {
    console.log(" ERROR from login ", error);
    return { data: error };
  }
};