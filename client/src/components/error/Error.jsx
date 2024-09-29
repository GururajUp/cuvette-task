import React from 'react';
import styles from './Error.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1 className={styles.errorHeading}>404 </h1>
        <p className={styles.errorMessage}>Page not found</p>
      </div>
    </div>
  );
};

export default ErrorPage;