import { useState, VoidFunctionComponent } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./Header";

interface ILayoutProps {
  checkifLoggedIn(cookie: string): void;
  cookies: { [x: string]: any };
  loggedInResponse: boolean;
  removeCookie(cookie: string): void;
}

export const Layout = (props: ILayoutProps) => {
  const CheckIfHeader = () => {
    const location = useLocation();
    if (location.pathname.indexOf("join") >= 0) {
      return <></>;
    } else {
      return (
        <Header
          cookies={props.cookies}
          checkifLoggedIn={props.checkifLoggedIn}
          loggedInResponse={props.loggedInResponse}
          removeCookie={props.removeCookie}
        />
      );
    }
  };
  return (
    <>
      <CheckIfHeader />

      <main>
        <Outlet></Outlet>
      </main>
    </>
  );
};
