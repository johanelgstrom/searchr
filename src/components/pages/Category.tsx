import "../../scss/category.scss";
import { Link } from "react-router-dom";
import { BackButton } from "../BackButton";

interface IList {
  _id: string;
  title: string;
  description: string;
}

interface ICategoryProps {
  list: IList[];
  heading: string;
  category: string;
}

export const Category = (props: ICategoryProps) => {
  return (
    <>
      <BackButton link="/dashboard" />
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
