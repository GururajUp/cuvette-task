import React, { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import { DEFAULT_CATEGORIES } from "../../utils/constants/constant";
import { updateStoryById, getStoryById } from "../../api/Story";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../addStory/AddStory.module.css";
import Loader from "../loader/Loader";
import closeIcon from "/closeIcon.svg";
import { useCustomContext } from "../../context/Context";

const EditStory = () => {
  const [slides, setSlides] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const {
    isLoading,
    setIsLoading,
    isModalVisible,
    setIsModalVisible,
    storyId,
  } = useCustomContext();

  const [createStoryVisible, setCreateStoryVisible] = useState(false);

  const fetchData = async (id) => {
    try {
      const response = await getStoryById(id);
      if (response && response.data) {
        setSlides(response.data.slides);
        console.log("EDIT STORY DATA :", slides);
        setIsEditing(true);
        setIsModalVisible(true);
        setCreateStoryVisible(true);
      }
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (storyId) {
      setIsLoading(true);
      fetchData(storyId);
      setIsModalVisible(true);
      setCreateStoryVisible(true);
      setIsEditing(true);
      console.log("STORY IDs :", storyId);
    } else {
      console.log("STORY IDs :", storyId);
      setIsModalVisible(true);
      setCreateStoryVisible(true);
    }
  }, [storyId]);

  const handleAddSlide = () => {
    const data = slides;
    if (data.length < 6) {
      data.push({ heading: "", description: "", imageUrl: "", categories: "" });
      setSlides([...data]);
    } else {
      alert("Maximum 6 slides are allowed");
    }
    setCurrentSlide(data.length - 1);
  };

  const handleRemoveSlide = (indexToRemove) => {
    const data = slides;
    if (data.length > 3) {
      const newSlides = data.filter((slide, index) => index !== indexToRemove);
      setSlides([...newSlides]);
      console.log("current SLIDE", currentSlide);
    } else {
      alert("Minimum 3 slides are allowed");
    }
    setCurrentSlide(data.length - 2);
  };

  const handleChange = (index, key, value) => {
    const data = [...slides];
    data[index][key] = value;
    console.log("INDEX , KEY", index, key);
    setSlides(data);
  };

  const handleSlideNavigation = (index) => {
    setCurrentSlide(index);
  };

  const handlePreviousClick = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevSlide) => prevSlide - 1);
      console.log("from prev option", currentSlide);
    } else {
      alert("This is the first slide");
    }
  };

  const handleNextClick = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prevSlide) => prevSlide + 1);
      console.log("from next option", currentSlide);
    } else {
      alert("This is the last slide");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const firstCategory = slides[0].categories;
    const allSlidesHaveSelectCategory = slides.every(
      (slide) => slide.categories !== ""
    );
    const isAnySlideIncomplete = slides.some(
      (slide) =>
        slide.heading === "" ||
        slide.description === "" ||
        slide.imageUrl === "" ||
        slide.categories === ""
    );

    try {
      if (isAnySlideIncomplete) {
        alert("Please fill out all fields for each slide");
      } else if (!allSlidesHaveSelectCategory) {
        alert("Please select a category for each slide");
      } else if (slides.length < 3 || slides.length > 6) {
        alert("Number of slides must be between 3 and 6");
      } else if (!slides.every((slide) => slide.categories === firstCategory)) {
        alert("All slides must have the same category");
      } else {
        console.log("STORY ID BEFORE SENDING TO BACKEND :", storyId);
        const response = await updateStoryById(storyId, slides);

        if (response.status === 201) {
          alert("Story created successfully!");
          setTimeout(() => {
            setCreateStoryVisible(false);
            setIsModalVisible(false);
            window.location.reload();
          }, 2000);
        } else if (response.status === 401) {
          alert("Unauthorized access");
        } else if (response.status === 422) {
          alert("Invalid input provided");
        } else if (response.status === 404) {
          alert("Story not found ! Please register your account");
        }
      }
    } catch (error) {
      console.error("Error creating story:", error.message);
      alert("Failed to create story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {isModalVisible && createStoryVisible && (
        <Modal>
          <div className={styles.mobileHeading}>
            {isEditing ? "Edit Story" : "Add Story to Feed"}
          </div>
          <div className={styles.mainContainer}>
            <div className={styles.storyNavBar}>
              {slides.map((slide, index) => (
                <button
                  key={index}
                  className={`${styles.slideNumber} ${
                    currentSlide === index ? styles.activeSlide : ""
                  }`}
                  onClick={() => handleSlideNavigation(index)}
                >
                  Slide {index + 1}
                  <img
                    src={closeIcon}
                    className={styles.removeSlideIcon}
                    onClick={() => handleRemoveSlide(index)}
                    alt="Remove Slide"
                  />
                </button>
              ))}
              {slides.length < 6 && (
                <button className={styles.slideNumber} onClick={handleAddSlide}>
                  Add+
                </button>
              )}
            </div>

            <form className={styles.storyForm} onSubmit={handleSubmit}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  style={{
                    display: index === currentSlide ? "block" : "none",
                  }}
                >
                  <div className={styles.addStoryContainer}>
                    <div className={styles.headingContainer}>
                      <label
                        htmlFor={`heading-${index}`}
                        className={styles.label}
                      >
                        Heading:
                      </label>
                      <input
                        type="text"
                        id={`heading-${index}`}
                        className={styles.heading}
                        name={`heading-${index}`}
                        placeholder="Your heading"
                        value={slide.heading}
                        onChange={(e) =>
                          handleChange(index, "heading", e.target.value)
                        }
                      />
                    </div>
                    <div className={styles.descriptionContainer}>
                      <label
                        htmlFor={`description-${index}`}
                        className={styles.label}
                      >
                        Description:
                      </label>
                      <input
                        type="text"
                        id={`description-${index}`}
                        className={styles.description}
                        name={`description-${index}`}
                        placeholder="Story description"
                        value={slide.description}
                        onChange={(e) =>
                          handleChange(index, "description", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.imageContainer}>
                      <label
                        htmlFor={`imageUrl-${index}`}
                        className={styles.label}
                      >
                        Image:
                      </label>
                      <input
                        type="text"
                        id={`imageUrl-${index}`}
                        className={styles.imageUrl}
                        name={`imageUrl-${index}`}
                        placeholder="Add image url"
                        value={slide.imageUrl}
                        onChange={(e) =>
                          handleChange(index, "imageUrl", e.target.value)
                        }
                      />
                    </div>

                    <div className={styles.categoriesContainer}>
                      <label
                        htmlFor={`categories-${index}`}
                        className={styles.label}
                      >
                        Categories:
                      </label>
                      <select
                        className={styles.categorySelect}
                        id={`categories-${index}`}
                        name={`categories-${index}`}
                        value={slide.categories}
                        onChange={(e) =>
                          handleChange(index, "categories", e.target.value)
                        }
                      >
                        <option value="" disabled>
                          Select Category
                        </option>
                        {DEFAULT_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              <div className={styles.slideControllers}>
                <div className={styles.slideMovement}>
                  <button
                    className={styles.previousBtn}
                    onClick={handlePreviousClick}
                    type="button"
                  >
                    Previous
                  </button>
                  <button
                    className={styles.nextBtn}
                    onClick={handleNextClick}
                    type="button"
                  >
                    Next
                  </button>
                </div>
                <button className={styles.postBtn} type="submit">
                  Post
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
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
};

export default EditStory;