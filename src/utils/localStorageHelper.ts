const ACCESS_TOKEN_KEY = "access_token";
const TYPE_KEY = "type";
const USER_KEY = "user";
const AGENTID_KEY = "agentID";
const FILEGUID_KEY = "fileGuid";

export const LocalStorageHelper = {
  /** Save access token to local storage */
  setAccessToken: (token: string): void => {
    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving access token:", error);
    }
  },

  /** Retrieve access token from local storage */
  getAccessToken: (): string => {
    try {
      return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
    } catch (error) {
      console.error("Error retrieving access token:", error);
      return "";
    }
  },

  /** Clear access token from local storage */
  clearAccessToken: (): void => {
    try {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error("Error clearing access token:", error);
    }
  },

  /** Save type to local storage */
  setRequestType: (type: string): void => {
    try {
      localStorage.setItem(TYPE_KEY, type);
    } catch (error) {
      console.error("Error saving type:", error);
    }
  },

  /** Retrieve type from local storage */
  getRequestType: (): string => {
    try {
      return localStorage.getItem(TYPE_KEY) || "";
    } catch (error) {
      console.error("Error retrieving type:", error);
      return "";
    }
  },

  /** Clear type from local storage */
  clearRequestType: (): void => {
    try {
      localStorage.removeItem(TYPE_KEY);
    } catch (error) {
      console.error("Error clearing type:", error);
    }
  },

  /** Save name to local storage */
  setUserName: (name: string): void => {
    try {
      localStorage.setItem(USER_KEY, name);
    } catch (error) {
      console.error("Error saving name:", error);
    }
  },

  /** Retrieve name from local storage */
  getUserName: (): string => {
    try {
      return localStorage.getItem(USER_KEY) || "";
    } catch (error) {
      console.error("Error retrieving name:", error);
      return "";
    }
  },

  /** Clear name from local storage */
  clearUserName: (): void => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error clearing name:", error);
    }
  },

  /** Save agentId and fileguid to local storage */
  setTCParams: (agentId: string, fileGuid: string): void => {
    try {
      localStorage.setItem(AGENTID_KEY, agentId);
      localStorage.setItem(FILEGUID_KEY, fileGuid);
    } catch (error) {
      console.error("Error saving tcParams:", error);
    }
  },

  /** Retrieve name from local storage */
  getAgentId: (): string => {
    try {
      return localStorage.getItem(AGENTID_KEY) || "";
    } catch (error) {
      console.error("Error retrieving AGENTID_KEY:", error);
      return "";
    }
  },

  getFileGuid: (): string => {
    try {
      return localStorage.getItem(FILEGUID_KEY) || "";
    } catch (error) {
      console.error("Error retrieving FILEGUID_KEY:", error);
      return "";
    }
  },

  /** Clear name from local storage */
  clearTCParams: (): void => {
    try {
      localStorage.removeItem(AGENTID_KEY);
      localStorage.removeItem(FILEGUID_KEY);
    } catch (error) {
      console.error("Error clearing tcParams:", error);
    }
  },
};
