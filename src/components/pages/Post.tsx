import axios from "axios";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import "../../scss/post.scss";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng, LatLngExpression } from "leaflet";

interface IPostProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
}

export const Post = (props: IPostProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [found, setFound] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [joinUrl, setJoinUrl] = useState<string>("");
  const [startingPoint, setStartingPoint] = useState<LatLngExpression>([
    62.633093, 16.084296,
  ]);
  const [searches, setSearches] = useState<Array<any>>([]);
  const [author, setAuthor] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  let jsxArray: Array<JSX.Element> = [];
  const colorArray = [
    { color: "lime" },
    { color: "red" },
    { color: "blue" },
    { color: "yellow" },
    { color: "purple" },
    { color: "pink" },
    { color: "black" },
    { color: "gold" },
    { color: "orange" },
  ];
  let { id } = useParams();
  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
    getPostData();
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);
  const getPostData = () => {
    axios({
      method: "get",
      url: `http://localhost:8000/post/${id}`,
    }).then((response) => {
      if (response.status !== 404) {
        setTitle(response.data.title);
        setDescription(response.data.description);
        setCategory(response.data.category);
        setFound(response.data.found);
        setDate(response.data.date);
        setStartingPoint(response.data.startingPoint);
        setSearches(response.data.searches);
        setImageUrl(`http://localhost:8000/post/img/${id}`);
        setJoinUrl(`/join/${id}`);
      }
    });
    if (props.cookies.userData !== undefined) {
      axios({
        method: "post",
        url: `http://localhost:8000/post/${id}/check-author`,
        data: {
          userData: props.cookies.userData,
        },
      }).then((response) => {
        if (response.status === 200) {
          setAuthor(true);
        } else {
          setAuthor(false);
        }
      });
    }
  };
  const handleFound = () => {
    axios({
      method: "post",
      url: `http://localhost:8000/post/${id}/change-active`,
      data: {
        userData: props.cookies.userData,
      },
    }).then((response) => {
      if (response.status === 200) {
        setFound(response.data.found);
      }
    });
  };

  const handleEdit = () => {
    if (editMode === false) {
      setEditMode(true);
    } else {
      axios({
        method: "put",
        url: `http://localhost:8000/post/${id}/edit`,
        data: {
          userData: props.cookies.userData,
          title: title,
          description: description,
          category: category,
        },
      }).then((response) => {
        console.log(response);
      });
      setEditMode(false);
    }
  };
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  const SearchLines = () => {
    for (let i = 0; i < searches.length; i++) {
      const randomIndex = Math.floor(Math.random() * colorArray.length);
      let oneSearch = (
        <Fragment>
          {searches[i].coordinates.map(
            (position: LatLngExpression, index: number) => {
              return <Marker key={index} position={position} opacity={0} />;
            }
          )}
          <Polyline
            pathOptions={colorArray[randomIndex]}
            positions={searches[i].coordinates}
          />
        </Fragment>
      );
      jsxArray.push(oneSearch);
    }
    return (
      <Fragment>
        {jsxArray.map((item, index) => {
          return item;
        })}
      </Fragment>
    );
  };

  return (
    <>
      <section className="post m-standard">
        <div className="content-standard">
          <div className="vertical-card">
            <div className="heading-container">
              {editMode ? (
                <input
                  name="title"
                  onChange={handleTitle}
                  value={title}
                  required
                ></input>
              ) : (
                <h1>{title}</h1>
              )}
            </div>
            <div className="big-image-container">
              <img src={imageUrl} />
            </div>
            <div className="info-container">
              <h2>Description</h2>
              {editMode ? (
                <textarea
                  name="description"
                  onChange={handleDescription}
                  value={description}
                ></textarea>
              ) : (
                <p>{description}</p>
              )}
            </div>
            <div className="info-container">
              <h2>Category</h2>

              {editMode ? (
                <select onChange={handleCategory} name="category" required>
                  <option value="people">People</option>
                  <option value="animal">Animals</option>
                  <option value="object">Objects</option>
                </select>
              ) : (
                <p>{category}</p>
              )}
            </div>
            <div className="map-container">
              <MapContainer
                center={startingPoint}
                zoom={4}
                scrollWheelZoom={true}
                style={{ height: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={startingPoint}>
                  <Popup>Starting point</Popup>
                </Marker>
                <SearchLines />
              </MapContainer>
            </div>
            {found ? (
              <>
                <li className="found-li">Found</li>
              </>
            ) : (
              <>
                <li className="found-li">Active since {date}</li>
              </>
            )}
            {props.loggedInResponse && props.cookies.userData !== undefined ? (
              <>
                <div className="join-button-container">
                  <div className="btn btn-secondary">
                    <Link to={joinUrl}>
                      <p>Join search</p>
                    </Link>
                  </div>
                  {author ? (
                    <>
                      <div className="btn btn-secondary" onClick={handleEdit}>
                        {editMode ? <p>Save</p> : <p>Edit post</p>}
                      </div>
                      <div className="btn btn-secondary" onClick={handleFound}>
                        {found ? <p>Mark as lost</p> : <p>Mark as found</p>}
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
