import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import { Layout } from "./components/Layout";
import { Home } from "./components/pages/Home";
import { Login } from "./components/pages/Login";
import { CreateAccount } from "./components/pages/CreateAccount";
import { Error } from "./components/pages/Error";
import axios from "axios";
import { Dashboard } from "./components/pages/Dashboard";
import { useCookies } from "react-cookie";
import { CreatePost } from "./components/pages/CreatePost";
import { Post } from "./components/pages/Post";
import { Category } from "./components/pages/Category";
import { Browse } from "./components/pages/Browse";
import { JoinSearch } from "./components/pages/JoinSearch";
function App() {
  const checkIfLoggedIn = async (cookie: string) => {
    await axios({
      method: "post",
      url: "http://localhost:8000/login/ifLoggedIn",
      data: {
        userData: cookie,
      },
    }).then((response) => {
      if (response.status === 200) {
        setLoggedInResponse(true);
      } else {
        setLoggedInResponse(false);
      }
    });
  };
  const [cookies, setCookie, removeCookie] = useCookies<string>(["userData"]);
  const [loggedInResponse, setLoggedInResponse] = useState<boolean>(false);
  const [peopleList, setPeopleList] = useState<Array<any>>([]);
  const [animalList, setAnimalList] = useState<Array<any>>([]);
  const [objectList, setObjectList] = useState<Array<any>>([]);

  useEffect(() => {
    axios.get("http://localhost:8000/post/all-people").then((response) => {
      setPeopleList(response.data);
    });
    axios.get("http://localhost:8000/post/all-animals").then((response) => {
      setAnimalList(response.data);
    });
    axios.get("http://localhost:8000/post/all-objects").then((response) => {
      setObjectList(response.data);
    });
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              cookies={cookies}
              checkifLoggedIn={checkIfLoggedIn}
              loggedInResponse={loggedInResponse}
              removeCookie={removeCookie}
            />
          }
        >
          <Route
            index
            element={
              <Home
                cookies={cookies}
                checkifLoggedIn={checkIfLoggedIn}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route
            path="/login"
            element={
              <Login
                cookies={cookies}
                setCookie={setCookie}
                removeCookie={removeCookie}
                checkifLoggedIn={checkIfLoggedIn}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route
            path="/create-account"
            element={
              <CreateAccount
                checkifLoggedIn={checkIfLoggedIn}
                cookies={cookies}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                checkifLoggedIn={checkIfLoggedIn}
                cookies={cookies}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route path="/browse" element={<Browse />}></Route>
          <Route
            path="/create-post"
            element={
              <CreatePost
                checkifLoggedIn={checkIfLoggedIn}
                cookies={cookies}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route
            path="/post/:id"
            element={
              <Post
                checkifLoggedIn={checkIfLoggedIn}
                cookies={cookies}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route
            path="/post/people"
            element={
              <Category
                list={peopleList}
                heading="Missing people"
                category="people"
              />
            }
          ></Route>
          <Route
            path="/post/animal"
            element={
              <Category
                list={animalList}
                heading="Missing pets"
                category="animal"
              />
            }
          ></Route>
          <Route
            path="/post/object"
            element={
              <Category
                list={objectList}
                heading="Missing objects"
                category="object"
              />
            }
          ></Route>
          <Route
            path="/join/:id"
            element={
              <JoinSearch
                checkifLoggedIn={checkIfLoggedIn}
                cookies={cookies}
                loggedInResponse={loggedInResponse}
              />
            }
          ></Route>
          <Route path="*" element={<Error />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
