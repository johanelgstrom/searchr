import axios from "axios";
import { useEffect, useState } from "react";
import "../../scss/user-page.scss";
import { Navigate } from "react-router-dom";
import { SmallCards } from "../SmallCards";
import { BackButton } from "../BackButton";
import { LatLng } from "leaflet";

interface ISearchResponse {
  coordinates: LatLng[];
  userId: string;
}

interface IPost {
  _id: string;
  creator: string;
  title: string;
  description: string;
  category: string;
  date: string;
  imageUrl: string;
  startingPoint: Array<number>;
  searches: ISearchResponse[];
  found: boolean;
}

interface IUserPageProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: string };
  loggedInResponse: boolean;
}

export const UserPage = (props: IUserPageProps) => {
  const [name, setName] = useState<string>("");
  const [allPosts, setAllPosts] = useState<IPost[]>([]);
  const [activePosts, setActivePosts] = useState<IPost[]>([]);
  const [foundPosts, setFoundPosts] = useState<IPost[]>([]);
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
