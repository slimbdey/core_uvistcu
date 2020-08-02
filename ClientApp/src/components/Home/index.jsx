import React, { Component } from 'react';
import { connect } from 'react-redux';
import { correctDate } from '../extra/extensions';


export class Home extends Component {
  static displayName = Home.name;

  state = {
    title: <div><h2 className="display-5">ДЕПАРТАМЕНТ АСУТП</h2></div>
  }


  goodParam = (hint, value) => <div className="d-flex"><div className="w-50">{hint}: </div><div className="text-success">{correctDate(value)}</div></div>
  badParam = (hint, value) => <div className="d-flex"><div className="w-50">{hint}: </div><div className="text-danger">{correctDate(value)}</div></div>


  render() {
    const user = this.props.user

    return (
      <div className="jumbotron" style={{ marginTop: -25, zIndex: -100, boxShadow: "0 0 20px gray", borderRadius: 10 }}>
        {this.state.title}
        <div className="text-muted text-uppercase">{user.fullName}</div>
        <div className="text-danger text-uppercase small">{this.props.role.name}</div>
        <hr />
        <div className="d-flex flex-row">
          <div className="col-md-4 pl-0">
            {this.goodParam("Медосмотр", user.medExam)}
            {this.goodParam("Охрана труда", user.labourSecurityExam)}
            {this.badParam("Промбезопасность", user.industrialSecurityExam)}
          </div>
          <div className="col-md-4 pl-0">
            {this.goodParam("Получил каску", user.gotHelmet)}
            {this.goodParam("Получил костюм", user.gotSuit)}
            {this.badParam("Получил ботинки", user.gotBoots)}
            {this.goodParam("Получил куртку", user.gotCoat)}
          </div>
        </div>
      </div>
    );
  }
}


/////////// MAPPS
const chunkStateToProps = state => {
  return { users: state.users, user: state.user, role: state.role }
}


export default connect(chunkStateToProps, null)(Home);