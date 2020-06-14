import React from "react";
import Spinner from "../layout/Spinner";

const NotFound = () => {
  return (
    <div>
      <Spinner />
      <h1>Not Found</h1>
      <p className="lead">
        The page you are looking for do not exist, please do a new search{" "}
      </p>
    </div>
  );
};
export default NotFound;
