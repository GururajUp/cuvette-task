import React, { useState, useEffect } from "react";
import { fetchAllBookmarks } from "../../api/Story";
import Loader from "../loader/Loader";
import { useCustomContext } from "../../context/Context";
import EditStory from "../editStory/EditStory";
import editBtn from "/editBtn.jpg"
import StoryViewer from "../storyViewer/StoryViewer";
import NavBar from "../navBar/NavBar";
import styles from "./Bookmark.module.css";

function UserStories() {
  const [showAll, setShowAll] = useState(false);
  const [storiesIDs, setStoriesIds] = useState([]);
  const [userSlides, setUserSlides] = useState([]);
  const {
    isLoading,
    setIsLoading,
    storyId,
    setStoryId,
    setIsModalVisible,
    createStoryVisible,
    setCreateStoryVisible,
    storyIdForStatus,
    setStoryIdForStatus,
    storyViewer, setStoryViewer
  } = useCustomContext();

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const userData = await fetchAllBookmarks();
        let userStories = userData.data.user.bookmarks;
        console.log("USER DATA",userStories);
        const extractedUserSlides = [];
        const extractedUserStoryIDs = [];

        userStories.forEach((story) => {
          const { _id: storyId, slides } = story;
          extractedUserStoryIDs.push(storyId);
          slides.forEach((slide) => {
            const { _id, heading, description, imageUrl, categories } = slide;
            extractedUserSlides.push({
              storyId,
              _id,
              heading,
              description,
              imageUrl,
              categories,
            });
          });
        });

        const newSlides = [];
        extractedUserStoryIDs.forEach((storyId) => {
          const temp = extractedUserSlides.find(
            (slide) => slide.storyId === storyId
          );  
          newSlides.push(temp);
        });
        setStoriesIds(extractedUserStoryIDs);
        setUserSlides(newSlides);
      } catch (error) {
        console.log(error);
      }
    };
    setIsLoading(false);
    fetchData();
  }, []);

  const handleEditing = (storyId) => {
    setStoryId(storyId);
    setIsModalVisible(true);
    setCreateStoryVisible(true);
    console.log("createStorySlide", createStoryVisible);
  };
  const handleStatusClick = (storyId) => {
    console.log("status clicked!")
    setStoryIdForStatus(storyId);
    setStoryViewer(true)
  };
  return (
    <>
    <NavBar/>
    {storyIdForStatus && <StoryViewer/>}
      {isLoading && <Loader />}
      {createStoryVisible && storyId && <EditStory />}
      <div className={styles.categoryContainer}>
        <div className={styles.heading}>Your Bookmarks</div>
        {userSlides.length === 0 && (
          <div className={styles.noStories}>No stories available</div>
        )}

        <div className={styles.slidesContainer}>
          {(showAll ? userSlides : userSlides.slice(0, 4)).map((slide) => (
            <div className={styles.slide} key={slide._id} >
              <div className={styles.slideContent}>
                <div className={styles.slideHeading}>{slide.heading}</div>
                <p className={styles.slideDescription}>{slide.description}</p>
              </div>
              <img
                src={slide.imageUrl}
                alt={slide.heading}
                className={styles.images}
                onClick={()=>handleStatusClick(slide.storyId)}
              />
              <button
                className={styles.editBtn}
                onClick={() => handleEditing(slide.storyId)}
              ><img src={editBtn} alt="edit button"></img>
                Edit
              </button>
            </div>
          ))}
        </div>

        {userSlides.length > 4 && !showAll && (
          <div className={styles.seeMoreContainer}>
            <button
              className={styles.seeMoreButton}
              onClick={() => setShowAll(true)}
            >
              See More
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default UserStories;