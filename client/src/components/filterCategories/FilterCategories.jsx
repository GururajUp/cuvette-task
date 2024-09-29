import React, { useEffect, useState } from "react";
import alls from "/all1.jpg";
import education from "/education.jpg";
import movies from "/movies.jpg";
import travel from "/travel.jpg";
import health from "/health.jpg";
import Loader from "../loader/Loader";
import food from "/food.jpg";
import { filterStories } from "../../api/Story";
import CategorySection from "../categorySection/CategorySection";
import { useCustomContext } from "../../context/Context";
import styles from "./FilterCategories.module.css";

const FilterCategories = () => {
  const { isLoading, setIsLoading } = useCustomContext();
  const [filterData, setFilterData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const response = await filterStories(selectedCategory);
        if (response.status === 200) {
          setFilterData(response.data.message);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        setError(error || "Error fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory, setIsLoading]);

  const handleCategoryClick = (category) => {
    console.log(`Clicked on ${category}`);
    setSelectedCategory(category);
  };
  const getBorderStyle = (category) => {
    return selectedCategory === category ? styles.selected : "";
  };

  return (
    <>
      {isLoading && <Loader />}
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.categoriesContainer}>
        <div className={styles.category} onClick={() => handleCategoryClick("")}>
          <span className={styles.headings}>All</span>
          <img
            src={alls}
            className={`${styles.categoryImg} ${getBorderStyle("")}`}
            alt="All"
          />
        </div>
        <div
          className={`${styles.category}`}
          onClick={() => handleCategoryClick("food")}
        >
          <span className={styles.headings}>Food</span>
          <img
            src={food}
            className={`${styles.categoryImg} ${getBorderStyle("food")}`}
            alt="Food"
          />
        </div>
        <div
          className={`${styles.category}`}
          onClick={() => handleCategoryClick("education")}
        >
          <span className={styles.headings}>Education</span>
          <img
            src={education}
            className={`${styles.categoryImg} ${getBorderStyle("education")}`}
            alt="Education"
          />
        </div>
        <div
          className={`${styles.category}`}
          onClick={() => handleCategoryClick("travel")}
        >
          <span className={styles.headings}>Travel</span>
          <img
            src={travel}
            className={`${styles.categoryImg} ${getBorderStyle("travel")}`}
            alt="Travel"
          />
        </div>
        <div
          className={`${styles.category}`}
          onClick={() => handleCategoryClick("health and fitness")}
        >
          <span className={`${styles.headings} ${styles.healthHeading}`}>
            Health and Fitness
          </span>
          <img
            src={health}
            className={`${styles.categoryImg} ${getBorderStyle(
              "health and fitness"
            )}`}
            alt="Health and Fitness"
          />
        </div>
        <div
          className={`${styles.category}`}
          onClick={() => handleCategoryClick("movies")}
        >
          <span className={styles.headings}>Movies</span>
          <img
            src={movies}
            className={`${styles.categoryImg} ${getBorderStyle("movies")}`}
            alt="Movies"
          />
        </div>
      </div>
      <CategorySection slidesData={filterData} category={selectedCategory} />
    </>
  );
};

export default FilterCategories;