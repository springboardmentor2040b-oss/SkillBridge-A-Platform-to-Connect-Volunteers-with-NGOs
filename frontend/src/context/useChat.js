import { useContext } from "react";
import ChatContext from "./ChatContext";

const useChat = () => {
  return useContext(ChatContext);
};

export default useChat;
