import { Link } from "react-router-dom";
import "../../scss/error.scss";
export const Error = () => {
  return (
    <>
      <section className="home m-standard">
        <div className="content-standard">
          <div className="heading-start-container">
            <h1>Oops, you're not supposed to be here</h1>
          </div>
          <div className="middle-start-container">
            <div className="btn btn-main">
              <Link to="/dashboard">
                <p>Take me back</p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
