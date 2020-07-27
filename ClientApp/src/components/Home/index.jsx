import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  state = {
    title: <div><h2 className="display-5">ДЕПАРТАМЕНТ АСУТП</h2></div>
  }


  render() {

    return (
      <div>
        <div className="jumbotron" style={{ opacity: 0.8, marginTop: -25, zIndex: -1, boxShadow: "0 0 20px gray", borderRadius: 10 }}>
          {this.state.title}
          <hr />
        </div>

      </div>
    );
  }
}
