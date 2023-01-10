import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import "../../scss/home.scss";

interface IHomeProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
}

export const Home = (props: IHomeProps) => {
  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
    console.log(props.loggedInResponse);
  }, []);

  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <Navigate to="/dashboard" />
      ) : (
        <section className="home m-standard">
          <div className="content-standard">
            <div className="heading-start-container">
              <h1>lets find those fuckers</h1>
            </div>
            <div className="middle-start-container">
              <div className="btn btn-main">
                <Link to="/login">
                  <p>Log in</p>
                </Link>
              </div>
              <div className="btn btn-main">
                <Link to="/create-account">
                  <p>Create account</p>
                </Link>
              </div>
              <div className="btn btn-main">
                <Link to="/browse">
                  <p>Browse posts</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
