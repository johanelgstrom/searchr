import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import "../../scss/home.scss";
import ctaVid from "../../assets/desktop-home-vid.mp4";
import catVid from "../../assets/cat-vid.mp4";

interface IHomeProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: string };
  loggedInResponse: boolean;
}

export const Home = (props: IHomeProps) => {
  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
  }, []);

  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <Navigate to="/dashboard" />
      ) : (
        <>
          <section className="home">
            <div className="content-container">
              <div className="video-container">
                <video src={ctaVid} autoPlay loop muted></video>
              </div>
              <div className="cta-container">
                <div className="heading-container">
                  <h1>searchr</h1>
                </div>
                <div className="middle-start-container">
                  <div className="btn btn-main">
                    <Link to="/login" id="login-btn">
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
            </div>
          </section>
          <section className="home">
            <div className="content-container reverse">
              <div className="video-container">
                <video
                  src={catVid}
                  autoPlay
                  loop
                  muted
                  className="flip-vid pos-right"
                ></video>
              </div>
              <div className="cta-container">
                <div className="heading-container">
                  <h1>What is this?</h1>
                </div>
                <div className="middle-start-container">
                  <p>
                    <i>
                      Searchr is a tool to help the community to search for
                      missing people, pets or objects.
                    </i>
                  </p>
                  <p>
                    <i>
                      You can create a missing post, where you decide the
                      starting point and the community can join in. All searches
                      will be desplayed on a map so you can plan your search
                      beforehand more easily.
                    </i>
                  </p>
                  <p>
                    <i>
                      Let's ditch the pen and paper and do it like it's supposed
                      to be in this digital era.
                    </i>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};
