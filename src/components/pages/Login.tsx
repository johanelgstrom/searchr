import axios from "axios";
import { useCookies } from "react-cookie";
import { ChangeEvent, useEffect, useState } from "react";
import "../../scss/login.scss";
import { Navigate } from "react-router-dom";

interface ILogin {
  checkifLoggedIn(cookie: string): void;
  loggedInResponse: boolean;
  cookies: { [x: string]: any };
  setCookie(name: string, value: any, option?: any): void;
  removeCookie(name: string, value: any, option?: any): void;
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
    console.log(username);
    console.log(password);
    axios({
      method: "post",
      url: "http://localhost:8000/login/login",
      data: {
        username: username,
        password: password,
      },
    }).then((response) => {
      console.log(response.status);
      if (
        response.data === "wrong password" ||
        response.data === "wrong username"
      ) {
        setErrorMsg(true);
      } else {
        console.log(response.data);
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
                    <input
                      placeholder="Username"
                      name="username"
                      onChange={handleUsername}
                      value={username}
                      required
                    ></input>
                    <input
                      placeholder="Password"
                      name="password"
                      type="password"
                      onChange={handlePassword}
                      value={password}
                      required
                    ></input>
                    <button type="submit" className="btn btn-main">
                      <p>Log in</p>
                    </button>
                  </form>
                </div>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
};
