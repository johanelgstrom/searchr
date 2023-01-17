import axios, { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import "../../scss/login.scss";
import { Navigate } from "react-router-dom";
import { BackButton } from "../BackButton";

interface ILogin {
  checkifLoggedIn(cookie: string): void;
  loggedInResponse: boolean;
  cookies: { [x: string]: string };
  setCookie(name: string, value: AxiosResponse<string>, option?: object): void;
  removeCookie(name: string, options?: object): void;
}

export const Login = (props: ILogin) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<boolean>(false);
  const [loginComplete, setLoginComplete] = useState<boolean>(false);
  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
  }, []);

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios({
      method: "post",
      url: "http://localhost:8000/login/login",
      data: {
        username: username,
        password: password,
      },
    }).then((response) => {
      if (
        response.data === "wrong password" ||
        response.data === "wrong username"
      ) {
        setErrorMsg(true);
      } else {
        props.setCookie("userData", response.data, {
          path: "/",
          expires: new Date(Date.now() + 8592000000000),
        });
        setLoginComplete(true);
      }
    });
  };

  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <Navigate to="/dashboard" />
        </>
      ) : (
        <>
          {loginComplete ? (
            <Navigate to="/dashboard" />
          ) : (
            <>
              <BackButton link="/" />
              <section className="login m-standard">
                <div className="content-standard">
                  <div className="heading-start-container">
                    <h1>Login</h1>
                  </div>
                  <div className="middle-start-container">
                    {errorMsg ? (
                      <p className="text-red">Wrong username and/or password</p>
                    ) : (
                      <></>
                    )}
                    <form onSubmit={handleSubmit}>
                      <label>Username</label>
                      <input
                        name="username"
                        onChange={handleUsername}
                        value={username}
                        required
                        id="username"
                      ></input>
                      <label>Password</label>
                      <input
                        name="password"
                        type="password"
                        onChange={handlePassword}
                        value={password}
                        id="password"
                        required
                      ></input>
                      <button type="submit" className="btn btn-main" id="login">
                        <p>Log in</p>
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </>
  );
};
