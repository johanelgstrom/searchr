//standard page template, not in use
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import "../../scss/template.scss";
import { Navigate } from "react-router-dom";

interface ITemplateProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
}

export const _template = (props: ITemplateProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
  }, []);

  // const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   axios({
  //     method: "post",
  //     url: "http://localhost:8000/x",
  //     data: {},
  //   }).then((response) => {
  //     console.log(response);
  //   });
  // };
  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <section className="template m-standard">
            <div className="content-standard">
              <div className="heading-container">
                <h1>Template</h1>
              </div>
              <div className="middle-container">
                {errorState ? <p className="text-red">{errorMsg}</p> : <></>}
              </div>
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
