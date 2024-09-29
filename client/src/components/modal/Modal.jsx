import closeBtn from "/closeBtn.svg";
import styles from "./Modal.module.css";
import { useCustomContext } from "../../context/Context";

function Modal({ children }) {
  const {
    isModalVisible,
    setIsModalVisible,
    createStoryVisible,
    setCreateStoryVisible,
    editOpen,
    setEditOpen,
    createStoryVisibility,
    setCreateStoryVisibility,
  } = useCustomContext();

  const handleModalToggle = () => {
    setIsModalVisible(false);
    setEditOpen(false);
    setCreateStoryVisible(false);
    setCreateStoryVisibility(false);
    console.log(isModalVisible)
    console.log(editOpen);
    console.log(createStoryVisibility);
    console.log(createStoryVisible);
  };
  return (
    isModalVisible && (
      <div className={styles.overlayContainer}>
        <div className={styles.modalContainer}>
          <img
            src={closeBtn}
            className={styles.closeBtnImg}
            alt="closeButtonImage"
            onClick={handleModalToggle}
          />
          {children}
        </div>
      </div>
    )
  );
}

export default Modal;