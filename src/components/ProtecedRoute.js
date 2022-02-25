import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";

const ProtecedRoute = ({ component: Component, componentProps, ...rest }) => {
  const { userInfo } = useSelector(state => state.auth);
  return (
    <Route
      {...rest}
      render={props => {
        const { location } = props;
        if (userInfo) {
          return <Component {...componentProps} {...props} />;
        }

        return (
          <Redirect
            to={{
              pathname: "/Login",
              state: { from: location }
            }}
          />
        );
      }}
    />
  );
};

export default ProtecedRoute;
