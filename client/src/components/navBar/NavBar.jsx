import bookmarkImg from "/bookmarkImg.svg";
import profileImg from "/profileImg.svg";
import hamburger from "/hamburger.svg";
import mobileMenuClose from "/mobileMenuClose.svg";
import { NavLink } from "react-router-dom";
import Login from "../login/Login";
import { useCustomContext } from "../../context/Context";
import { useState } from "react";
import Register from "../register/Register";
import AddStory from "../addStory/AddStory";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./NavBar.module.css";

function NavBar() {
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const {
    setIsModalVisible,
    isRegisterModalVisible,
    setRegisterModalVisible,
    isLoginModalVisible,
    setLoginModalVisible,
    createStoryVisibility,
    setCreateStoryVisibility,
  } = useCustomContext();

  const [isAddStoryVisible, setAddStoryVisible] = useState(false);
  const [isDropDownVisible, setDropDownVisible] = useState(false);
  const [isMobileDropdownVisible, setMobileDropdown] = useState(false);

  const openRegisterModal = () => {
    setIsModalVisible(true);
    setRegisterModalVisible(true);
    setLoginModalVisible(false);
    setAddStoryVisible(false);
  };

  const openLoginModal = () => {
    setIsModalVisible(true);
    setLoginModalVisible(true);
    setRegisterModalVisible(false);
    setAddStoryVisible(false);
  };

  const openAddStoryModal = () => {
    setIsModalVisible(true);
    setAddStoryVisible(true);
    setCreateStoryVisibility(true);
    setLoginModalVisible(false);
    setRegisterModalVisible(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("User Logout Successful");
    setTimeout(() => {
      //window.location.href = "/";
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <nav className={styles.navContainer}>
        <div className={styles.logoContainer}>
          <NavLink to="/" className={styles.logoName}>
            SwipTory
          </NavLink>
        </div>
        <div className={styles.navlinkContainer}>
          {token ? (
            <div className={styles.navlinkSubContainer2}>
              <NavLink to="/bookmarks" className={styles.navlinkBookmark}>
                <img
                  src={bookmarkImg}
                  alt="bookmark"
                  className={styles.bookmarkImg}
                />
                Bookmarks
              </NavLink>
              <NavLink
                className={styles.navlinkAddStory}
                onClick={openAddStoryModal}
              >
                Add Story
              </NavLink>
              <div>
                <img
                  className={styles.navlinkProfile}
                  src={profileImg}
                  alt="profile"
                />
              </div>
              <div className={styles.hamburgerContainer}>
                <img
                  className={styles.navlinkHamburger}
                  src={hamburger}
                  alt="hamburger"
                  onClick={() => setDropDownVisible(!isDropDownVisible)}
                />
              </div>
              {isDropDownVisible && (
                <div className={styles.dropdown}>
                  <div className={styles.username}>{userName}</div>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.navlinkSubContainer1}>
              <NavLink
                className={styles.navlinkRegister}
                onClick={openRegisterModal}
              >
                Register Now
              </NavLink>
              <NavLink
                className={styles.navlinkSignin}
                onClick={openLoginModal}
              >
                Sign In
              </NavLink>
            </div>
          )}
          {isLoginModalVisible && <Login />}
          {isRegisterModalVisible && <Register />}
          {isAddStoryVisible && <AddStory />}
        </div>

        <div className={styles.mobileMenu}>
          <img
            className={styles.mobileHamburger}
            src={hamburger}
            alt="hamburger"
            onClick={() => setMobileDropdown(true)}
          />
          {isMobileDropdownVisible && (
            <div className={styles.mobileDropdown}>
              {token ? (
                <>
                  <div className={styles.userDetails}>
                    <div className={styles.userDetailsSubContainer}>
                      <img
                        className={styles.navlinkProfile}
                        src={profileImg}
                        alt="profile"
                      />
                      <div className={styles.mobileUserName}>{userName}</div>
                    </div>
                    <img
                      src={mobileMenuClose}
                      className={styles.mobileDropDownClose}
                      alt="closeIcon"
                      onClick={() => setMobileDropdown(false)}
                    />
                  </div>
                  <NavLink to="/yourStories" className={styles.navlinkAddStory}>
                    Your Story
                  </NavLink>
                  <NavLink
                    className={styles.navlinkAddStory}
                    onClick={openAddStoryModal}
                  >
                    Add Story
                  </NavLink>
                  <NavLink to="/bookmarks" className={styles.navlinkBookmark}>
                    <img
                      src={bookmarkImg}
                      alt="bookmark"
                      className={styles.bookmarkImg}
                    />
                    Bookmarks
                  </NavLink>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className={styles.mobileSubContainer1}>
                    <img
                      src={mobileMenuClose}
                      className={styles.mobileDropDownClose}
                      alt="closeIcon"
                      onClick={() => setMobileDropdown(false)}
                    />
                    <NavLink
                      className={styles.navlinkRegister}
                      onClick={openLoginModal}
                    >
                      Login
                    </NavLink>

                    <NavLink
                      className={styles.navlinkRegister}
                      onClick={openRegisterModal}
                    >
                      Register
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
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
export default NavBar;