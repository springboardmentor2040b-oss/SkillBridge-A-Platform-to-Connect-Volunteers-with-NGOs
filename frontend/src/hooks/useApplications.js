import { useContext } from "react";
import { ApplicationContext } from "../context/ApplicationContext";

export const useApplications = () => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplications must be used within an ApplicationProvider"
    );
  }

  return context;
};
