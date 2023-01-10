//standard page template, not in use
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import "../../scss/category.scss";
import { Link, Navigate } from "react-router-dom";

interface ICategoryProps {
  list: Array<any>;
  heading: string;
  category: string;
}

export const Category = (props: ICategoryProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {}, []);

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
      <section className="category m-standard">
        <div className="content-standard">
          <div className="heading-container">
            <h1>{props.heading}</h1>
          </div>
          <div className="vertical-card">
            <div className="small-card-container">
              {props.list.map((object) => {
                return (
                  <Link to={`/post/${object._id}`}>
                    <div className="small-card" key={object._id}>
                      <div className="img-container">
                        <img
                          src={`http://localhost:8000/post/img/${object._id}`}
                        />
                      </div>
                      <div className="text-container">
                        <h3>{object.title.substring(0, 50)}</h3>
                        <p>{object.description.substring(0, 150)}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
