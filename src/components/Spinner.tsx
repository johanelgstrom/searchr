import spinner from "../assets/Ripple-1s-200px.svg";
import "../scss/_spinner.scss";
export const Spinner = () => {
  return (
    <>
      <div className="spinner-container">
        <img src={spinner} />
      </div>
    </>
  );
};
