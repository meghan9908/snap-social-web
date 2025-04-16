
import FeedPage from "./FeedPage";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  
  return (
    <FeedPage />
  );
};

export default Index;
