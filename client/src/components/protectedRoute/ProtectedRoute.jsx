import { Navigate } from "react-router-dom";
import {userId} from "../../utils/constants/constant"

function ProtectedRoute({ Component }) {
  return <div>{userId ? <Component /> : <Navigate to="/" />}</div>;
}

export default ProtectedRoute;