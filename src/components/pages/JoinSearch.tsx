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
  cookies: { [x: string]: any };
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
  const success = (position: any) => {
    const latLngLocation = new LatLng(
      position.coords.latitude,
      position.coords.longitude
    );
    console.log(latLngLocation);
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
  // const HandlePins = () => {
  //   console.log("här e ja");

  //   return (
  //     <Fragment>
  //       <>
  //         {markers.map((position, i) => {
  //           console.log(position);
  //           console.log(markers);
  //           <Marker key={i} position={position}>
  //             <Popup>Starting point</Popup>
  //           </Marker>;
  //         })}
  //       </>
  //     </Fragment>
  //   );
  // };

  // setInterval(() => {
  //   const xd = () => {
  //     LocationMarker();
  //   };
  // }, 5000);

  // function LocationMarker() {
  //   const [position, setPosition] = useState<LatLngExpression>({
  //     lat: 0,
  //     lng: 0,
  //   });

  //   useEffect(() => {
  //     map.locate().on("locationfound", function (e) {
  //       console.log(e.latlng);

  //       setPosition(e.latlng);
  //       map.flyTo(e.latlng, 18);
  //       const radius = e.accuracy;
  //       const circle = L.circle(e.latlng, 3);
  //       circle.addTo(map);
  //     });
  //   }, [map]);

  //   return position === null ? null : <Marker position={position}></Marker>;
  // }

  const MapComponent = () => {
    const map = useMap();

    useEffect(() => {
      interval.current = window.setInterval(() => {
        setHeading("Searching...");
        const updatedMarkers = [...markers];

        // these 4 lines are for testing
        let a = Math.floor(Math.random() * 100);
        let b = Math.floor(Math.random() * 100);
        const latLngLocation = new LatLng(a, b);
        updatedMarkers.push(latLngLocation);

        // updatedMarkers.push(currentPosition);
        setMarkers(updatedMarkers);
        //ändra numret till typ 17 vid produktion
        map.flyTo(latLngLocation, 4);
      }, 5000);

      return () => {
        window.clearInterval(interval.current);
        interval.current = 0;
      }; // clean up interval on unmount
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
      console.log(response);
      if (response.status === 200) {
        setTimeout(() => {
          setRedirect(true);
        }, 1500);
      }
    });
  };
  // const handlePosition = (lat: any, long: any) => {
  //   console.log(lat);
  //   console.log(long);
  // };

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
      {props.loggedInResponse && props.cookies.userData !== undefined ? (
        <>
          <section className="join-search m-small">
            <div className="content-container">
              <div className="heading-container">
                <h1>{heading}</h1>
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
                      <div className="btn btn-main" onClick={stopHandeler}>
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
