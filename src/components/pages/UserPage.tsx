//standard page template, not in use
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import "../../scss/user-page.scss";
import { Navigate } from "react-router-dom";
import { SmallCards } from "../SmallCards";
import { BackButton } from "../BackButton";

interface IUserPageProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
}

export const UserPage = (props: IUserPageProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [allPosts, setAllPosts] = useState<Array<any>>([]);
  const [activePosts, setActivePosts] = useState<Array<any>>([]);
  const [foundPosts, setFoundPosts] = useState<Array<any>>([]);
  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
    axios({
      method: "post",
      url: "http://localhost:8000/login/user-data",
      data: {
        userData: props.cookies.userData,
      },
    }).then((response) => {
      setName(response.data.name);
    });
    axios({
      method: "post",
      url: "http://localhost:8000/post/get-user-posts",
      data: {
        userData: props.cookies.userData,
      },
    }).then((response) => {
      setAllPosts(response.data);
    });
  }, []);

  useEffect(() => {
    console.log(allPosts);

    // let tempActive = [];
    // let tempFound = [];
    // for (let i = 0; i < allPosts.length; i++) {
    //   console.log(allPosts[i]);

    //   if (allPosts[i].found === false) {
    //     tempActive.push(allPosts[i]);
    //   } else {
    //     tempFound.push(allPosts[i]);
    //   }
    // }
    // setActivePosts(tempActive);
    // setFoundPosts(tempFound);
    let tempActive = allPosts.filter((post) => post.found === false);
    let tempFound = allPosts.filter((post) => post.found === true);
    setActivePosts(tempActive);
    setFoundPosts(tempFound);
  }, [allPosts]);

  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <BackButton link="/dashboard" />
          <section className="user-page m-standard">
            <div className="content-standard">
              <div className="heading-container">
                <h1>Your page {name}</h1>
              </div>
            </div>
          </section>
          <section className="dashboard m-standard">
            <div className="content-standard">
              <SmallCards
                list={activePosts}
                heading="Active searches"
                category="profile"
                bypass={true}
              />

              <SmallCards
                list={foundPosts}
                heading="Found"
                category="profile"
                bypass={true}
              />
            </div>
          </section>
        </>
      ) : (
        <>
          <Navigate to="/dashboard" />
        </>
      )}
    </>
  );
};
