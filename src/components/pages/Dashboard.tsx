import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Error } from "./Error";
import "../../scss/dashboard.scss";
import { Spinner } from "../Spinner";
import axios from "axios";
import { SmallCards } from "../SmallCards";
interface IDashboardProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
}
export const Dashboard = (props: IDashboardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [peopleList, setPeopleList] = useState<Array<any>>([]);
  const [animalList, setAnimalList] = useState<Array<any>>([]);
  const [objectList, setObjectList] = useState<Array<any>>([]);
  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
    console.log(props.cookies.userData);

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
  setTimeout(() => {
    setIsLoading(false);
  }, 300);
  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <section className="dashboard m-standard">
            <div className="content-standard">
              <div className="heading-container">
                <h1>dashboard</h1>
              </div>
              <div className="cta-container">
                <div className="btn btn-main">
                  <Link to="/create-post">
                    <p>Create post</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>
          <section className="dashboard m-standard">
            <div className="content-standard">
              <SmallCards
                list={peopleList}
                heading="Missing people"
                category="people"
              />
              <SmallCards
                list={animalList}
                heading="Missing pets"
                category="animal"
              />
              <SmallCards
                list={objectList}
                heading="Missing objects"
                category="object"
              />
            </div>
          </section>
        </>
      ) : (
        <>
          {isLoading ? (
            <>
              <Spinner />
            </>
          ) : (
            <Navigate to="/" />
          )}
        </>
      )}
    </>
  );
};
