import React, { useState, Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';

const ModalExample = (props) => {
  const {
    buttonLabel,
    className,
    text,
    func
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = (e) => {
    e.preventDefault();
    setModal(!modal);
  }

  return (
    <div>
      <a href="/" className="text-danger" onClick={toggle}>{buttonLabel}</a>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalBody>{text}</ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={(e) => { func(); toggle(e); }}>Да</Button>{' '}
          <Button color="secondary" onClick={toggle}>Нет</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}


export class DateGroup extends Component {

  render() {
    return (
      <div className="input-group form-group">
        <div className="input-group-prepend">
          <button className="btn btn-outline-info" type="button"
            onClick={() => document.getElementsByName(this.props.name)[0].value = (new Date()).toISOString().slice(0, 10)}
          > Сегодня</button>
        </div>
        <input type="date" className="form-control date" name={this.props.name} defaultValue={this.props.value.slice(0, 10)} />
        <div className="input-group-append">
          <span className="input-group-text">{this.props.hint}</span>
        </div>
      </div>
    );
  }
}


export class InputGroup extends Component {

  render() {
    return (
      this.props.reversed
        ? <div className="input-group form-group">
          <input className="form-control" name={this.props.name} defaultValue={this.props.value} />
          <div className="input-group-append">
            <span className="input-group-text">{this.props.hint}</span>
          </div>
        </div>
        : <div className="input-group form-group">
          <div className="input-group-prepend">
            <span className="input-group-text">{this.props.hint}</span>
          </div>
          <input className="form-control" name={this.props.name} defaultValue={this.props.value} />
        </div>
    );
  }
}


export class Loading extends Component {
  render = () => <img alt="Loading..." src="ajax_loader.gif" height={70} />;
}





export default ModalExample;