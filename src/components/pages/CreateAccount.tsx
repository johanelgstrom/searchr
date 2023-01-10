import axios from "axios";
import { useCookies } from "react-cookie";
import { ChangeEvent, useEffect, useState } from "react";
import "../../scss/create-account.scss";
import { Navigate } from "react-router-dom";

interface ICreateAccountProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
}

export const CreateAccount = (props: ICreateAccountProps) => {
  const [cookies, setCookie, removeCookie] = useCookies<string>(["userData"]);
  const [name, setName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loginComplete, setLoginComplete] = useState<boolean>(false);

  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
  }, []);

  const handleName = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const handleEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name);
    console.log(username);
    console.log(email);
    console.log(password);
    console.log(passwordConfirm);
    axios({
      method: "post",
      url: "http://localhost:8000/login/register",
      data: {
        name: name,
        username: username,
        email: email,
        password: password,
        confirmPassword: passwordConfirm,
      },
    }).then((response) => {
      console.log(response);
      if (
        response.data === "Username or email already exists" ||
        response.data === "Password don't match"
      ) {
        setErrorMsg(response.data);
        setErrorState(true);
      } else {
        console.log(response.data);
        setCookie("userData", response.data, {
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
                  <h1>Create Account</h1>
                </div>
                <div className="middle-start-container">
                  {errorState ? <p className="text-red">{errorMsg}</p> : <></>}
                  <form onSubmit={handleSubmit}>
                    <input
                      placeholder="Name"
                      name="name"
                      onChange={handleName}
                      value={name}
                      required
                    ></input>
                    <input
                      placeholder="Username"
                      name="username"
                      onChange={handleUsername}
                      value={username}
                      required
                    ></input>
                    <input
                      placeholder="Email"
                      name="email"
                      onChange={handleEmail}
                      value={email}
                      type="email"
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
                    <input
                      placeholder="Confirm password"
                      name="passwordConfirm"
                      type="password"
                      onChange={handlePasswordConfirm}
                      value={passwordConfirm}
                      required
                    ></input>
                    <button type="submit" className="btn btn-main">
                      <p>Create</p>
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
