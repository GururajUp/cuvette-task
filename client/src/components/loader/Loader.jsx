import { useEffect,useState } from "react";
import { Puff } from "react-loader-spinner";
import styles from "./loader.module.css";

function Loader() {
  const [size, setSize] = useState(80);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 525) {
        setSize(40); 
      } else {
        setSize(80); 
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize(); 

    return () => window.removeEventListener("resize", handleResize); 
  }, []);

  return (
    <div className={styles.loaderOverlay}>
      <Puff
        visible={true}
        height={size} 
        width={size} 
        color="#ff7373"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

export default Loader;