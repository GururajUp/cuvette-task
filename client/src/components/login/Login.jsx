import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../modal/Modal";
import Loader from "../loader/Loader";
import { loginUser } from "../../api/Auth";
import { useCustomContext } from "../../context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Login.module.css";

function Login() {
  const [loginValues, setLoginValues] = useState({
    userName: "",
    password: "",
  });

  const { setLoginModalVisible, setUserData, userData } = useCustomContext();
  const navigate = useNavigate();
  const [passwordView, setPasswordView] = useState(false);
  const [errors, setErrors] = useState("");
  const { isLoading, setIsLoading } = useCustomContext();

  const handlePasswordView = () => {
    setPasswordView(!passwordView);
  };

  const handleOnChange = (e) => {
    setLoginValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!loginValues.userName) {
        setErrors("Username is required");
      } else if (!loginValues.password) {
        setErrors("Password is required");
      } else {
        setIsLoading(true);
        const response = await loginUser(
          loginValues.userName,
          loginValues.password
        );
        console.log("RESPONSE", response);
        if (response.status === 200) {
          setTimeout(() => {
            setLoginModalVisible(false);
            navigate("/");
          }, 1200);
          alert("User login successful!");
          setUserData({
            userName: localStorage.getItem("userName"),
            token: localStorage.getItem("token"),
            userId: localStorage.getItem("userId"),
          });
          console.log("USER DATA", userData);
          setTimeout(() => {
            window.location.reload();
          }, 1600);
        } else if (
          response &&
          response.data &&
          response.data.response &&
          response.data.response.status === 404
        ) {
          alert("User not found");
        } else if (
          response &&
          response.data &&
          response.data.response &&
          response.data.response.status === 401
        ) {
          alert("Invalid Credentials!");
        }
      }
    } catch (error) {
      setLoginValues({
        userName: "",
        password: "",
      });
      console.log("Error from login:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <Modal>
        <div className={styles.registerHeading}>Login to SwipTory</div>
        <form className={styles.registerFormContainer} onSubmit={handleSubmit}>
          <div className={styles.registerSubContainer}>
            <label htmlFor="loginUsername" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="loginUsername"
              className={styles.input1}
              placeholder="Enter username"
              name="userName"
              value={loginValues.userName}
              onChange={handleOnChange}
            ></input>
          </div>
          <div className={styles.registerSubContainer}>
            <label htmlFor="LoginPassword" className={styles.label}>
              Password
            </label>
            <input
              type={passwordView ? "text" : "password"}
              id="LoginPassword"
              className={styles.input2}
              placeholder="Enter password"
              name="password"
              value={loginValues.password}
              onChange={handleOnChange}
            ></input>
            <img
              src="/passwordLookup.svg"
              className={styles.eyeImg}
              onClick={handlePasswordView}
            ></img>
          </div>
          {errors && <div className={styles.error}>{errors}</div>}
          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>
      </Modal>
       <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="colored"
      />
    </>
  );
}

export default Login;