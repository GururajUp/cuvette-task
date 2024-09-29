import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL;

export const addStory = async (slides) => {
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(`${BACKEND_URL}/story/create`, {
      slides,
    });
    return response;
  } catch (error) {
    return { data: error };
  }
};

export const filterStories = async (category) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/story/filter?category=${category}`
    );
    return response;
  } catch (error) {
    return { data: error };
  }
};

export const yourStory = async () => {
  try {
    const userId = localStorage.getItem("userId") || "";
    const response = await axios.get(`${BACKEND_URL}/story/yourStory`, {
      params: {
        userId: userId,
      },
    });

    return response.data;
  } catch (error) {
    return { data: error };
  }
};

export const getStoryById = async (storyId) => {
  try {
    console.log("STORY ID FROM API", storyId);
    const response = await axios.get(`${BACKEND_URL}/story/view`, {
      params: {
        id: storyId,
      },
    });
    console.log("RESPONSE FROM getstoryById", response);
    return response;
  } catch (error) {
    console.log("ERROR from getStoryById", error);
    return { data: error };
  }
};

export const updateStoryById = async (storyId, slides) => {
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const queryParams = {
      params: {
        storyId: storyId,
      },
    };

    const response = await axios.put(
      `${BACKEND_URL}/story/edit`,
      { slides },
      queryParams
    );

    console.log("Response:", response);
    return response;
  } catch (error) {
    console.error("Error updating story:", error);
    return { data: error };
  }
};


export const addLikeToStory = async (storyId) => {
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(`${BACKEND_URL}/story/like`, {
      storyId: storyId 
    });

    console.log("RESPONSE FROM ADDLIKETOSTORY", response);
    return response;
  } catch (error) {
    console.log("Error from addLikeToStory", error);
    return { data: error };
  }
};



export const unLikeStory = async (storyId) => {
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.patch(`${BACKEND_URL}/story/unlike`, {
      id: storyId 
    });

    console.log("RESPONSE FROM unLIKE story", response);
    return response;
  } catch (error) {
    console.log("Error from unLIKE story", error);
    return { data: error };
  }
};
export const userData = async () => {
  try {
    const userId = localStorage.getItem("userId") || "";
    const response = await axios.get(`${BACKEND_URL}/story/userData`, {
      params: {
        userId: userId,
      },
    });

    return response.data;
  } catch (error) {
    return { data: error };
  }
};

export const addBookmark = async(storyId)=>{
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.post(`${BACKEND_URL}/auth/bookmarks`, {
      id: storyId 
    });
    console.log("response in addBookmark",response);
    return response;
  } catch (error) {
    console.log("error in addBookmark",error);
    return {data:error};
  }
}

export const removeBookmark = async(storyId)=>{
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.patch(`${BACKEND_URL}/auth/bookmarks`, {
      id: storyId 
    });
    console.log("response in removeBookmark",response);
    return response;
  } catch (error) {
    console.log("error in removeBookmark",error);
    return {data:error};
  }
}
export const fetchAllBookmarks = async()=>{
  try {
    const token = localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await axios.get(`${BACKEND_URL}/auth/bookmarks`);
    console.log("response in fetchAllBookmarks",response);
    return response;
  } catch (error) {
    console.log("error in fetchAllBookmarks",error);
    return {data:error};
  }
}