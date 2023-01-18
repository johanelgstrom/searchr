import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import "../../scss/join-search.scss";
import { Navigate, useParams } from "react-router-dom";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLng, LatLngExpression } from "leaflet";
import { Spinner } from "../Spinner";

interface IJoinSearchProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: string };
  loggedInResponse: boolean;
}

export const JoinSearch = (props: IJoinSearchProps) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [readyToSearch, setReadyToSearch] = useState<boolean>(false);
  const [startingPosition, setStartingPosition] = useState<LatLngExpression>({
    lat: 0,
    lng: 0,
  });
  const [currentPosition, setCurrentPosition] =
    useState<LatLngExpression>(startingPosition);
  const [markers, setMarkers] = useState<Array<LatLngExpression>>([]);
  const [heading, setHeading] = useState<string>("Joining serach...");
  const [redirect, setRedirect] = useState<boolean>(false);
  const limeOptions = { color: "lime" };
  const interval = useRef(0);
  let { id } = useParams();

  useEffect(() => {
    props.checkifLoggedIn(props.cookies.userData);
    axios.get(`http://localhost:8000/post/${id}`).then((response) => {
      if (response.status === 200) {
        setStartingPosition(response.data.startingPoint);
        setReadyToSearch(true);

        if ("geolocation" in navigator) {
          setStartingPosition(response.data.startingPoint);
          const watchID = navigator.geolocation.watchPosition(
            success,
            error,
            options
          );
        } else {
          console.log("inte ok");
        }
      }
    });
  }, []);
  const success = (position: GeolocationPosition) => {
    const latLngLocation = new LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    setCurrentPosition(latLngLocation);
  };

  function error() {
    setHeading("No position available. Turn on tracking and try again");
    return;
  }

  const options = {
    enableHighAccuracy: true,
    maximumAge: 60000,
    timeout: 57000,
  };

  const MapComponent = () => {
    const map = useMap();

    useEffect(() => {
      interval.current = window.setInterval(() => {
        setHeading("Searching...");
        const updatedMarkers = [...markers];

        // these 4 lines are for testing
        // let a = Math.floor(Math.random() * 100);
        // let b = Math.floor(Math.random() * 100);
        // const latLngLocation = new LatLng(a, b);
        // updatedMarkers.push(latLngLocation);

        // production
        updatedMarkers.push(currentPosition);

        setMarkers(updatedMarkers);
        //ändra numret till typ 17 vid produktion, ca 4 vid test
        map.flyTo(currentPosition, 17);
      }, 5000);

      return () => {
        window.clearInterval(interval.current);
        interval.current = 0;
      };
    }, []);

    return (
      <Fragment>
        {markers.map((marker, index) => {
          return <Marker key={index} position={marker} opacity={0} />;
        })}
        <Polyline pathOptions={limeOptions} positions={markers} />
      </Fragment>
    );
  };

  const stopHandeler = async () => {
    window.clearInterval(interval.current);
    interval.current = 0;
    setHeading("Great job! Redirecting..");
    axios({
      method: "post",
      url: `http://localhost:8000/post/${id}/post-search`,
      data: {
        userData: props.cookies.userData,
        coordinates: markers,
      },
    }).then((response) => {
      if (response.status === 200) {
        setTimeout(() => {
          setRedirect(true);
        }, 1500);
      }
    });
  };
  return (
    <>
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <section className="join-search">
            <div className="content-container">
              <div className="heading-container">
                <h1 id="heading">{heading}</h1>
              </div>
              <div className="middle-container">
                {errorState ? <p className="text-red">{errorMsg}</p> : <></>}
                {readyToSearch ? (
                  <>
                    <div className="map-container">
                      <MapContainer
                        center={startingPosition}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{ height: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={startingPosition}>
                          <Popup>Starting point</Popup>
                        </Marker>

                        <MapComponent />
                      </MapContainer>
                    </div>
                    <div className="button-container">
                      <div
                        className="btn btn-main"
                        onClick={stopHandeler}
                        id="stop-search-btn"
                      >
                        <p>Stop searching</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Spinner />
                  </>
                )}
              </div>
            </div>
          </section>
          {redirect ? (
            <>
              <Navigate to={`/post/${id}`} />
            </>
          ) : (
            <></>
          )}
        </>
      ) : (
        <>
          <Navigate to="/dashboard" />
        </>
      )}
    </>
  );
};
