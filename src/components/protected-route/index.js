import { Navigate } from "react-router-dom";
import { useUserAuth } from "context/user-auth-context";
import Loading from "components/loading";
const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();
  const isObjectEmpty = (objectName) => {
    return (
      objectName &&
      Object.keys(objectName).length === 0 &&
      objectName.constructor === Object
    );
  };

  if (isObjectEmpty(user)) {
    return <Loading></Loading>;
  }
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
