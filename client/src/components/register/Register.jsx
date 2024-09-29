import { useState } from "react";
import passwordViewImg from "/passwordLookup.svg";
import Modal from "../modal/Modal";
import Loader from "../loader/Loader";
import Login from "../login/Login";
import { registerUser } from "../../api/Auth";
import { useCustomContext } from "../../context/Context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Register.module.css";

function Register() {
  const [registerValues, setRegisterValues] = useState({
    userName: "",
    password: "",
  });

  const [passwordView, setPasswordView] = useState(false);

  const [errors, setErrors] = useState("");

  const {
    isLoading,
    setIsLoading,
    setRegisterModalVisible,
    isLoginModalVisible,
    setLoginModalVisible,
  } = useCustomContext();

  const handlePasswordView = () => {
    setPasswordView(!passwordView);
  };

  const handleOnChange = (e) => {
    setRegisterValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  // prev values helps in taking previous userName data else it will forget userName

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate username and password
      if (!registerValues.userName) {
        setErrors("username is required");
      } else if (!registerValues.password) {
        setErrors("password is required");
      } else if (registerValues.userName.length < 3) {
        setErrors("minimum 3 characters in username");
      } else if (registerValues.password.length < 5) {
        setErrors("minimum 5 characters in password");
      } else {
        setIsLoading(true);
        const response = await registerUser(
          registerValues.userName,
          registerValues.password
        );
        console.log("RESPONSE", response);

        if (response.status === 200) {
          alert("User registered successfully!");
            setRegisterModalVisible(false);
            setLoginModalVisible(true);
        } else if (
          response &&
          response.data &&
          response.data.response &&
          response.data.response.status === 409
        ) {
          alert("Please give unique username. Username already exists")

        } else {
          alert("Registration failed! Please try again later")

        }
      }
    } catch (error) {
      console.log("Error from register:", error);
      setRegisterValues({
        userName: "",
        password: "",
      });
      setRegisterModalVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {isLoginModalVisible && <Login />}
      <Modal>
        <div className={styles.registerHeading}>Register to SwipTory</div>

        <form className={styles.registerFormContainer} onSubmit={handleSubmit}>
          <div className={styles.registerSubContainer}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              type="text"
              id="username"
              className={styles.input1}
              placeholder="Enter username"
              name="userName"
              value={registerValues.userName}
              onChange={handleOnChange}
            ></input>
          </div>

          <div className={styles.registerSubContainer}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type={passwordView ? "text" : "password"}
              id="password"
              className={styles.input2}
              placeholder="Enter password"
              name="password"
              value={registerValues.password}
              onChange={handleOnChange}
            ></input>
            <img
              src={passwordViewImg}
              className={styles.eyeImg}
              onClick={handlePasswordView}
              alt="passwordEyeImage"
            ></img>
          </div>

          {errors && <div className={styles.error}>{errors}</div>}
          <button type="submit" className={styles.submitBtn}>
            Register
          </button>
        </form>
      </Modal>
     <ToastContainer  autoClose={2000}/>
    </>
  );
}

export default Register;