import { createContext, useContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    token: "",
    userId: "",
  });
  const [isRegisterModalVisible, setRegisterModalVisible] = useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [storyId, setStoryId] = useState("");
  const [createStoryVisible, setCreateStoryVisible] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createStoryVisibility, setCreateStoryVisibility] = useState(false);
  const [storyIdForStatus, setStoryIdForStatus] = useState("");
  const [storyViewer, setStoryViewer] = useState(false);
  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        isModalVisible,
        setIsModalVisible,
        userData,
        setUserData,
        isRegisterModalVisible,
        setRegisterModalVisible,
        isLoginModalVisible,
        setLoginModalVisible,
        storyId,
        setStoryId,
        createStoryVisible,
        setCreateStoryVisible,
        editOpen,
        setEditOpen,
        createStoryVisibility,
        setCreateStoryVisibility,
        storyIdForStatus,
        setStoryIdForStatus,
        storyViewer, setStoryViewer
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCustomContext = () => {
  const useContextValue = useContext(Context);
  if (!useContextValue) {
    throw Error("context value is outside provider!");
  }
  return useContextValue;
};