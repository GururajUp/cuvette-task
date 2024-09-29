import { useEffect, useState } from "react";
import { DEFAULT_CATEGORIES } from "../../utils/constants/constant";
import { useCustomContext } from "../../context/Context";
import Loader from "../loader/Loader";
import { yourStory } from "../../api/Story";
import StoryViewer from "../storyViewer/StoryViewer";
import editBtn from "/editBtn.jpg";
import styles from "./CategorySection.module.css";
import EditStory from "../editStory/EditStory";

function CategorySection({ slidesData = [], category }) {
  const {
    isLoading,
    setIsLoading,
    storyId,
    setStoryId,
    setIsModalVisible,
    editOpen,
    setEditOpen,
    storyIdForStatus,
    setStoryIdForStatus,
    storyViewer,
    setStoryViewer,
  } = useCustomContext();

  const [stories, setStories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandCategory, setExpandCategory] = useState({});
  const [storiesIDs, setStoriesIds] = useState([]);
  const [userSlides, setUserSlides] = useState({});
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const userData = await yourStory();
      console.log("USER DATA", userData);
      const { story: userStories } = userData.user || [];

      // Process user data or userStories
      const extractedUserSlides = [];
      const extractedUserStoryIDs = [];

      if (userStories) {
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
      } else {
        console.log("user not logged in");
      }
      // console.log("USER SLIDES :", userSlides);

      // process data for ALL category
      const updatedStories = {};
      DEFAULT_CATEGORIES.forEach((categoryName) => {
        updatedStories[categoryName] = [];
        const newStoryID = [];

        slidesData.forEach((story) => {
          const storyId = story._id;
          story.slides.forEach((slide) => {
            const { _id, heading, description, categories, imageUrl } = slide;
            if (categories === categoryName && !newStoryID.includes(storyId)) {
              updatedStories[categoryName].push({
                storyId: storyId,
                _id,
                heading,
                description,
                categories,
                imageUrl,
              });
              newStoryID.push(storyId);
            }
          });
        });

        updatedStories[categoryName].sort((a, b) =>
          a.storyId > b.storyId ? 1 : -1
        );
        setStories(updatedStories);
      });

      setIsLoading(false);
    };

    fetchData();
  }, [slidesData, setIsLoading]);

  const handleSeeMoreClick = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleCategorySeeMoreClick = (categoryName) => {
    setExpandCategory((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };
  const handleEditing = (storyID) => {
    setEditOpen(true);
    setIsModalVisible(true);
    setStoryId(storyID);
    console.log("edit open", editOpen);
    console.log("story id edit open", storyId);
  };

  const handleStatusClick = (storyId) => {
    console.log("status clicked!");
    setStoryViewer(true);
    setStoryIdForStatus(storyId);
  };
  return (
    <>
      {storyViewer && <StoryViewer />}
      {editOpen && storyId && <EditStory />}
      {isLoading && <Loader />}
      <div className={styles.categorySectionContainer}>
        {category === "" ? (
          <>
            {userSlides.length > 0 && (
              <div className={styles.categoryContainer}>
                <div className={styles.heading}>Your Stories</div>
                {userSlides.length === 0 && (
                  <div className={styles.noStories}>No stories available</div>
                )}

                <div className={styles.slidesContainer}>
                  {(showAll ? userSlides : userSlides.slice(0, 4)).map(
                    (slide) => (
                      <div className={styles.slide} key={slide._id}>
                        <div className={styles.slideContent}>
                          <div className={styles.slideHeading}>
                            {slide.heading}
                          </div>
                          <p className={styles.slideDescription}>
                            {slide.description}
                          </p>
                        </div>
                        <img
                          src={slide.imageUrl}
                          alt={slide.heading}
                          className={styles.images}
                          onClick={() => handleStatusClick(slide.storyId)}
                        />
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditing(slide.storyId)}
                        >
                          <img src={editBtn} alt="edit button"></img>
                          Edit
                        </button>
                      </div>
                    )
                  )}
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
            )}

            {Object.keys(stories).map((categoryName) => (
              <div key={categoryName} className={styles.category}>
                <div className={styles.heading}>
                  Top Stories About {categoryName}
                </div>
                <div className={styles.slidesContainer}>
                  {stories[categoryName].slice(0, 4).map((slide) => (
                    <div key={slide._id} className={styles.slide}>
                      <img
                        src={slide.imageUrl}
                        className={styles.images}
                        alt={slide.heading}
                        onClick={() => handleStatusClick(slide.storyId)}
                      />
                      <div className={styles.slideContent}>
                        <div className={styles.slideHeading}>
                          {slide.heading}
                        </div>
                        <div className={styles.slideDescription}>
                          {slide.description}
                        </div>
                      </div>
                      {storiesIDs.includes(slide.storyId) && (
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEditing(slide.storyId)}
                        >
                          <img src={editBtn} alt="edit button"></img>
                          Edit
                        </button>
                      )}
                    </div>
                  ))}
                  {stories[categoryName].length === 0 && (
                    <div className={styles.noStories}>No stories Available</div>
                  )}
                  {expandedCategories[categoryName] &&
                    stories[categoryName].slice(4).map((slide) => (
                      <div key={slide._id} className={styles.slide}>
                        <img
                          src={slide.imageUrl}
                          className={styles.images}
                          alt={slide.heading}
                          onClick={() => handleStatusClick(slide.storyId)}
                        />
                        <div className={styles.slideContent}>
                          <div className={styles.slideHeading}>
                            {slide.heading}
                          </div>
                          <p className={styles.slideDescription}>
                            {slide.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
                {stories[categoryName].length > 4 && (
                  <div className={styles.btnControl}>
                    {!expandedCategories[categoryName] && (
                      <button
                        className={styles.seeMoreButton}
                        onClick={() => handleSeeMoreClick(categoryName)}
                      >
                        See more
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className={styles.categorySectionContainer}>
            <div className={styles.heading}>Top Stories About {category}</div>
            <div className={styles.slidesContainer}>
              {stories[category].slice(0, 4).map((slide) => (
                <div key={slide._id} className={styles.slide}>
                  <img
                    src={slide.imageUrl}
                    className={styles.images}
                    alt={slide.heading}
                    onClick={() => handleStatusClick(slide.storyId)}
                  />
                  <div className={styles.slideContent}>
                    <div className={styles.slideHeading}>{slide.heading}</div>
                    <div className={styles.slideDescription}>
                      {slide.description}
                    </div>
                  </div>
                  {storiesIDs.includes(slide.storyId) && (
                    <button
                      className={styles.editBtn}
                      onClick={() => handleEditing(slide.storyId)}
                    >
                      <img src={editBtn} alt="edit button"></img>
                      Edit
                    </button>
                  )}
                </div>
              ))}
              {stories[category].length === 0 && (
                <div className={styles.noStories}>No stories Available</div>
              )}
              {expandCategory[category] &&
                stories[category].slice(4).map((slide) => (
                  <div key={slide._id} className={styles.slide}>
                    <img
                      src={slide.imageUrl}
                      className={styles.images}
                      alt={slide.heading}
                      onClick={() => handleStatusClick(slide.storyId)}
                    />
                    <div className={styles.slideContent}>
                      <div className={styles.slideHeading}>{slide.heading}</div>
                      <p className={styles.slideDescription}>
                        {slide.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            {stories[category].length > 4 && (
              <div className={styles.btnControl}>
                {!expandCategory[category] && (
                  <button
                    className={styles.seeMoreButton}
                    onClick={() => handleCategorySeeMoreClick(category)}
                  >
                    See more
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default CategorySection;