import React, { Component } from "react";

export class Footer extends Component {

  render() {
    return (
      <div className="footer fixed-bottom bg-light">
        <hr className="m-0" />
        <div className="container mb-1 mt-1">
          <span className="text-muted text-uppercase">асутп - 2020</span>
        </div>
      </div>
    );
  }
}