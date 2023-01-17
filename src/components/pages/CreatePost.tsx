import axios from "axios";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import "../../scss/create-post.scss";
import { Navigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, Map } from "leaflet";
import { BackButton } from "../BackButton";

interface ICreatePostProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: string };
  loggedInResponse: boolean;
}

export const CreatePost = (props: ICreatePostProps) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("people");
  const [selectedFile, setSelectedFile] = useState<any>();
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [postLink, setPostLink] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [center, setCenter] = useState<LatLngExpression>([
    62.633093, 16.084296,
  ]);
  const zoom: number = 4;
  const [map, setMap] = useState<Map | null>(null);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        ref={setMap}
        style={{ height: "100%" }}
      >
        <div className="marker">+</div>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    ),
    []
  );

  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
    const L = require("leaflet");

    delete L.Icon.Default.prototype._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSelectedFile(e.target.files[0]);
  };

  function DisplayPosition({ map }: any) {
    const [position, setPosition] = useState(() => map.getCenter());
    const onClick = useCallback(() => {
      map.setView(center, zoom);
    }, [map]);

    const onMove = useCallback(() => {
      setPosition(map.getCenter());
      setCenter(map.getCenter());
    }, [map]);

    useEffect(() => {
      map.on("move", onMove);
      return () => {
        map.off("move", onMove);
      };
    }, [map, onMove]);
    return <></>;
  }

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (category === "") {
      setErrorMsg("Please choose a category");
      return;
    }
    const formData = new FormData();

    formData.append("image", selectedFile);
    axios
      .post("http://localhost:8000/post/post-img", formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      })
      .then((response) => {
        let latLongString = center.toString();
        axios({
          method: "post",
          url: "http://localhost:8000/post/create-post",
          data: {
            userData: props.cookies.userData,
            title,
            description,
            category,
            startingPoint: center,
            img: response.data,
          },
        }).then((res) => {
          setPostLink(`/post/${res.data}`);
          setSuccess(true);
        });
      });
  };
  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <BackButton link="/dashboard" />
          <section className="create-post m-standard">
            <div className="content-standard">
              <div className="heading-container">
                <h1>Create post</h1>
              </div>
              <div className="middle-container">
                {errorState ? <p className="text-red">{errorMsg}</p> : <></>}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <label htmlFor="title">
                    <p>Title</p>
                  </label>
                  <input
                    name="title"
                    onChange={handleTitle}
                    value={title}
                    required
                    id="title"
                  ></input>
                  <label htmlFor="description">
                    <p>Description</p>
                  </label>
                  <textarea
                    name="description"
                    onChange={handleDescription}
                    value={description}
                    required
                    id="description"
                  ></textarea>
                  <label htmlFor="category">
                    <p>Category</p>
                  </label>
                  <select
                    onChange={handleCategory}
                    name="category"
                    required
                    id="category"
                  >
                    <option value="People">People</option>
                    <option value="Animal">Animals</option>
                    <option value="Object">Objects</option>
                  </select>
                  <label htmlFor="image">
                    <p>Image</p>
                  </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleFile}
                    required
                  ></input>
                  <div className="map-container">
                    {map ? <DisplayPosition map={map} /> : null}
                    {displayMap}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-main"
                    id="submit-btn"
                  >
                    <p>Create</p>
                  </button>
                </form>
              </div>
            </div>
          </section>
          {success ? (
            <>
              <Navigate to={postLink} />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <Navigate to="/" />
        </>
      )}
    </>
  );
};
