import { Link } from "react-router-dom";
import arrow from "../assets/arrow-left.svg";
import "../scss/_backbutton.scss";

interface IBackButtonProps {
  link: string;
}

export const BackButton = (props: IBackButtonProps) => {
  return (
    <>
      <div className="back-btn-container">
        <div className="btn btn-main">
          <Link to={props.link}>
            <img src={arrow} />
          </Link>
        </div>
      </div>
    </>
  );
};
