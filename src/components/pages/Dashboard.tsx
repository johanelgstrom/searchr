import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../../scss/dashboard.scss";
import { Spinner } from "../Spinner";
import axios from "axios";
import { SmallCards } from "../SmallCards";
interface IList {
  _id: string;
  title: string;
  description: string;
  found: boolean;
}
interface IDashboardProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: string };
  loggedInResponse: boolean;
}
export const Dashboard = (props: IDashboardProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [peopleList, setPeopleList] = useState<IList[]>([]);
  const [animalList, setAnimalList] = useState<IList[]>([]);
  const [objectList, setObjectList] = useState<IList[]>([]);
  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);

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
                <div className="btn btn-main" id="create-btn">
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
                category="People"
                bypass={false}
              />
              <SmallCards
                list={animalList}
                heading="Missing pets"
                category="Animal"
                bypass={false}
              />
              <SmallCards
                list={objectList}
                heading="Missing objects"
                category="Object"
                bypass={false}
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
