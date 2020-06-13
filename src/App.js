import React, { useState, Fragment } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import axios from "axios";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  //Add dark mode
  const [darkMode, setDarkMode] = React.useState(getInitialMode());

  //Set mode to local storage
  React.useEffect(() => {
    localStorage.setItem("dark", JSON.stringify(darkMode));
  }, [darkMode]);
  //Save mode in local storage
  function getInitialMode() {
    const saveMode = JSON.parse(localStorage.getItem("dark"));
    return saveMode || false;
  }

  //Search Github users
  const searchUsers = async (text) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=
      ${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=
      ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );
    setUsers(res.data.items);
    setLoading(false);
  };

  //Search single user
  const getUser = async (username) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=
      ${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=
      ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    setUser(res.data);
    setLoading(false);
  };

  //Get users repos
  const getUserRepos = async (username) => {
    setLoading(true);

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=
      ${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=
      ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
    );

    setRepos(res.data);
    setLoading(false);
  };

  //Clear user from state
  const clearUsers = () => {
    setUsers([]);
    setLoading(false);
  };

  //Set Alert
  const showAlert = (msg, type) => {
    setAlert({ msg: msg, type: type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <Router>
      <div
        // style={{ height: "100%" }}
        className={darkMode ? "dark-mode" : "App"}
      >
        <Navbar />
        <i
          onClick={() => setDarkMode((prevMode) => !prevMode)}
          className={darkMode ? "far fa-moon" : "far fa-lightbulb"}
          style={{
            fontSize: "2rem",
            border: "2px solid gray",
            borderRadius: "30px",
            padding: "0.3rem",
            marginRight: "0.5rem",
            float: "right",
          }}
        ></i>

        <div className="container ">
          <Alert alert={alert} />
          <Switch>
            <Route
              exact
              path="/"
              render={(props) => (
                <Fragment>
                  <Search
                    searchUsers={searchUsers}
                    clearUsers={clearUsers}
                    showClear={users.length > 0 ? true : false}
                    setAlert={showAlert}
                  />
                  <Users loading={loading} users={users} />
                </Fragment>
              )}
            />
            <Route exact path="/about" component={About} />
            <Route
              exact
              path="/user/:login"
              render={(props) => (
                <User
                  {...props}
                  getUser={getUser}
                  getUserRepos={getUserRepos}
                  user={user}
                  repos={repos}
                  loading={loading}
                />
              )}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
};

export default App;
