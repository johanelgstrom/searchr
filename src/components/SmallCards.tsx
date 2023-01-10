import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../scss/small-cards.scss";

interface ISmallCardsProps {
  list: Array<any>;
  heading: string;
  category: string;
}

export const SmallCards = (props: ISmallCardsProps) => {
  return (
    <>
      <div className="vertical-card">
        <div className="heading-container">
          <h1>{props.heading}</h1>
        </div>
        <div className="small-card-container">
          {props.list.map((object, index) => {
            console.log(object);

            if (index < 6 && object.found === false) {
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
            }
          })}
          {props.list.length === 0 ? (
            <div className="empty-container">
              <p>Nothing missing right now</p>
            </div>
          ) : (
            <></>
          )}
        </div>
        {props.list.length > 6 ? (
          <div className="btn btn-secondary">
            <Link to={`/post/${props.category}`}>
              <p>See all</p>
            </Link>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
