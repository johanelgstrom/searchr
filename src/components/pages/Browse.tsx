import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../scss/dashboard.scss";
import axios from "axios";
import { SmallCards } from "../SmallCards";

export const Browse = () => {
  const [peopleList, setPeopleList] = useState<Array<any>>([]);
  const [animalList, setAnimalList] = useState<Array<any>>([]);
  const [objectList, setObjectList] = useState<Array<any>>([]);
  useEffect(() => {
    axios.get("http://localhost:8000/post/all-people").then((response) => {
      setPeopleList(response.data);
    });
    axios.get("http://localhost:8000/post/all-animals").then((response) => {
      setAnimalList(response.data);
    });
    axios.get("http://localhost:8000/post/all-objects").then((response) => {
      setObjectList(response.data);
    });
  }, []);
  return (
    <>
      <section className="dashboard m-standard">
        <div className="content-standard">
          <div className="heading-container">
            <h1>Browse</h1>
          </div>
        </div>
      </section>
      <section className="dashboard m-standard">
        <div className="content-standard">
          <SmallCards
            list={peopleList}
            heading="Missing people"
            category="people"
          />
          <SmallCards
            list={animalList}
            heading="Missing pets"
            category="animal"
          />
          <SmallCards
            list={objectList}
            heading="Missing objects"
            category="object"
          />
        </div>
      </section>
    </>
  );
};
