import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import "../scss/header.scss";

interface IHeaderProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: string };
  loggedInResponse: boolean;
  removeCookie(cookie: string): void;
}

export const Header = (props: IHeaderProps) => {
  const [burgerState, setBurgerState] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [logout, setLogout] = useState<boolean>(false);
  useEffect(() => {
    axios({
      method: "post",
      url: "http://localhost:8000/login/user-data",
      data: {
        userData: props.cookies.userData,
      },
    }).then((response) => {
      setName(response.data.username);
    });
  }, [props.cookies.userData]);
  const handleBurger = () => {
    setBurgerState(!burgerState);
  };
  const logoutHandeler = () => {
    setLogout(true);
    props.removeCookie("userData");
  };
  return (
    <>
      {logout ? (
        <>
          <Navigate to="/" />
        </>
      ) : (
        <>
          <header>
            <div className="inner-container">
              <div className="left-container">
                <h3 className="logo">
                  <Link to="/">searchr</Link>
                </h3>
              </div>
              {props.cookies.userData !== undefined ? (
                <div
                  className="right-container"
                  onClick={handleBurger}
                  id="burger-container"
                >
                  <div
                    className={
                      burgerState
                        ? "burger top-bun-open"
                        : "burger top-bun-closed"
                    }
                  ></div>
                  <div
                    className={
                      burgerState ? "burger patty-open" : "burger patty-closed"
                    }
                  ></div>
                  <div
                    className={
                      burgerState
                        ? "burger bottom-bun-open"
                        : "burger bottom-bun-closed"
                    }
                  ></div>
                </div>
              ) : (
                <></>
              )}
            </div>
            {props.cookies.userData !== undefined ? (
              <div
                className={
                  burgerState ? "burger-menu open" : "burger-menu closed"
                }
              >
                <h2>Hello {name}</h2>
                <div className="inner-menu">
                  <div className="btn btn-secondary">
                    <Link to="/profile" onClick={handleBurger}>
                      <p>Profile</p>
                    </Link>
                  </div>
                  <div
                    className="btn btn-secondary"
                    onClick={logoutHandeler}
                    id="logout-btn"
                  >
                    <p>Log out</p>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </header>
        </>
      )}
    </>
  );
};
