import React, { useEffect, useState, useRef } from "react";
import { useCustomContext } from "../../context/Context";
import {
  getStoryById,
  addLikeToStory,
  unLikeStory,
  userData,
  addBookmark,
  removeBookmark,
} from "../../api/Story";
import Loader from "../loader/Loader";
import prevBtn from "/prev.png";
import nextBtn from "/next2.png";
import closeBtn from "/closeInView.png";
import shareBtn from "/share.png";
import bookmarkImg from "/bookmark.png";
import unBookmarkImg from "/unbookmark.png";
import unlikeImg from "/unlike.png";
import likeImg from "/like.png";
import { userId } from "../../utils/constants/constant";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./StoryViewer.module.css";

const FRONTEND_URL = "https://swiptory-frontend-hecq.vercel.app";

const StoryViewer = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    setIsLoading,
    storyIdForStatus,
    storyViewer,
    setStoryViewer,
    setLoginModalVisible,
    setIsModalVisible,
  } = useCustomContext();

  const [isLikedByUser, setIsLikedByUser] = useState(false);
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState([]);
  const [user, setUser] = useState({});
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkCollection, setBookmarkCollection] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  const progressBarRef = useRef(null);

  const handleClose = () => {
    setStoryViewer(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 525);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check initial size

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getStatusById = async (storyId) => {
      try {
        setIsLoading(true);
        const response = await getStoryById(storyId);
        if (response && response.data) {
          setSlides(response.data.slides);
          setLikeCount(response.data.likes);
          setIsDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching story data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (storyIdForStatus) {
      getStatusById(storyIdForStatus);
    } else {
      console.log("No story id for status available");
    }
  }, [storyIdForStatus, setIsLoading]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await userData();
        if (response) {
          console.log("user data :", response);
          setUser(response);
          setBookmarkCollection(response.user.bookmarks);
        } else {
          console.log("user data :", response);
          setUser("");
          setIsBookmarked(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setTimeout(() => {
          setStoryViewer(false);
          setIsModalVisible(true);
          setLoginModalVisible(true);
        }, 1500);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [setIsLoading, storyIdForStatus, storyViewer]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex < slides.length - 1 ? prevIndex + 1 : 0
      );
      // Update progress bar
      if (progressBarRef.current) {
        progressBarRef.current.style.width = "0";
        setTimeout(() => {
          progressBarRef.current.style.width = "100%";
        }, 100);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [slides]);

  const handleLike = async (storyId) => {
    try {
      if (userId) {
        const response = await addLikeToStory(storyId);
        console.log("res like", response);

        if (response && response.data) {
          const updatedLikes = response.data.message || [];
          setLikeCount(updatedLikes);
          let isLiked = response.data.message.includes(userId);
          console.log("IS LIKED", isLiked);
          setIsLikedByUser(isLiked);
          setIsDataLoaded(true);
        }
      } else {
        console.log("User not logged in");
        navigate("/");
        setTimeout(() => {
          setStoryViewer(false);
          setIsModalVisible(true);
          setLoginModalVisible(true);
        }, 500);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const handleUnlike = async (storyId) => {
    try {
      const response = await unLikeStory(storyId);
      console.log("res like", response);

      if (response && response.data) {
        const updatedLikes = response.data.message || [];
        setLikeCount(updatedLikes);
        let isUnliked = response.data.message.includes(userId);
        console.log("IS UNLIKED", isUnliked);
        setIsLikedByUser(isUnliked);
        setIsDataLoaded(true);
      }
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  useEffect(() => {
    const isLiked = likeCount.includes(userId);
    setIsLikedByUser(isLiked);
    console.log(isLiked);
  }, [likeCount]);

  useEffect(() => {
    const isBookmark = bookmarkCollection.includes(storyIdForStatus);
    setIsBookmarked(isBookmark);
  }, [bookmarkCollection, storyIdForStatus]);

  const handleAddBookmark = async (storyId) => {
    try {
      if (user) {
        const response = await addBookmark(storyId);
        console.log("response for user`1", response);
        if (response.status === 200) {
          setIsBookmarked(true);
        } else {
          console.log("user not found");
        }
      } else {
        console.log("User not logged in");
        navigate("/");
        setTimeout(() => {
          setStoryViewer(false);
          setIsModalVisible(true);
          setLoginModalVisible(true);
        }, 500);
      }
    } catch (error) {
      console.log("could not add a bookmark", error);
    }
  };

  const handleUnbookmark = async (storyId) => {
    try {
      if (user) {
        const response = await removeBookmark(storyId);
        console.log("response for user`1", response);
        if (response.status === 200) {
          setIsBookmarked(false);
        } else {
          console.log("user not found");
        }
      } else {
        console.log("User not logged in");
        navigate("/");
        setTimeout(() => {
          setStoryViewer(false);
          setIsModalVisible(true);
          setLoginModalVisible(true);
        }, 500);
      }
    } catch (error) {
      console.log("could not add a bookmark", error);
    }
  };

  const handleImageClick = (event) => {
    if (isMobileView) {
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const width = rect.width;
      const halfWidth = width / 2;

      if (x < halfWidth) {
        setCurrentSlideIndex((prev) =>
          prev > 0 ? prev - 1 : slides.length - 1
        );
      } else {
        setCurrentSlideIndex((prev) =>
          prev < slides.length - 1 ? prev + 1 : 0
        );
      }
    }
  };
  const handleShareClick = (storyId) => {
    const slideShowLink = `${FRONTEND_URL}/viewStory/${storyId}`;
    navigator.clipboard.writeText(slideShowLink);
    alert("Link copied!");
  };

  return storyViewer ? (
    <div className={styles.overlayContainer}>
      <img
        className={styles.nextBtn}
        src={prevBtn}
        alt="Previous"
        onClick={() =>
          setCurrentSlideIndex((prev) =>
            prev > 0 ? prev - 1 : slides.length - 1
          )
        }
      />
      <div className={styles.statusContainer}>
        {isLoading || !isDataLoaded ? (
          <Loader />
        ) : (
          <div className={styles.slide} onClick={handleImageClick}>
            <div className={styles.firstContainer}>
              <div className={styles.closeImg}>
                <img src={closeBtn} alt="close button" onClick={handleClose} />
              </div>
              <div className={styles.shareImg}>
                <img
                  src={shareBtn}
                  alt="share button"
                  onClick={() => handleShareClick(storyIdForStatus)}
                />
              </div>
            </div>
            <img
              src={slides[currentSlideIndex].imageUrl}
              alt="Slide"
              className={styles.images}
            />
            <div className={styles.slideContent}>
              <h3>{slides[currentSlideIndex].heading}</h3>
              <p>{slides[currentSlideIndex].description}</p>
            </div>
          </div>
        )}
        <div className={styles.reactions}>
          <div className={styles.bookmarkContainer}>
            {isBookmarked ? (
              <img
                src={unBookmarkImg}
                alt="unBookmark image"
                onClick={() => handleUnbookmark(storyIdForStatus)}
              />
            ) : (
              <img
                src={bookmarkImg}
                alt="bookmark image"
                onClick={() => handleAddBookmark(storyIdForStatus)}
              />
            )}
          </div>
          <div className={styles.likeContainer}>
            {isLikedByUser ? (
              <img
                src={unlikeImg}
                alt="unlike image"
                onClick={() => handleUnlike(storyIdForStatus)}
              />
            ) : (
              <img
                src={likeImg}
                alt="like image"
                onClick={() => handleLike(storyIdForStatus)}
              />
            )}
            <div className={styles.likeCount}>{likeCount.length}</div>
          </div>
        </div>
      </div>
      <img
        src={nextBtn}
        className={styles.prevBtn}
        alt="Next"
        onClick={() =>
          setCurrentSlideIndex((prev) =>
            prev < slides.length - 1 ? prev + 1 : 0
          )
        }
      />
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
    </div>
  ) : null;
};

export default StoryViewer;