import React from "react";
import { Spinner } from "reactstrap";
import "./authSpinner.css";

const AuthSpinner = () => (
  <div className="detaultAuthSpinner">
    <Spinner style={{ width: "3rem", height: "3rem" }} type="grow" />
  </div>
);

export default AuthSpinner;
