import React, { useState, PureComponent } from 'react';
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


export const DateGroup = props => {
  return (
    <div className="input-group form-group">
      <div className="input-group-prepend">
        <button className="btn btn-outline-info" type="button"
          onClick={() => document.getElementsByName(props.name)[0].value = (new Date()).toISOString().slice(0, 10)}
        > Сегодня</button>
      </div>
      <input type="date" className="form-control date" name={props.name} defaultValue={props.value && props.value.slice(0, 10)} />
      <div className="input-group-append">
        <span className="input-group-text">{props.hint}</span>
      </div>
    </div>
  );
}


export const InputGroup = props => {
  return (
    props.reversed
      ? <div className="input-group form-group">
        <input className="form-control" name={props.name} defaultValue={props.value} placeholder={props.placeholder} />
        <div className="input-group-append">
          <span className="input-group-text">{props.hint}</span>
        </div>
      </div>
      : <div className="input-group form-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.hint}</span>
        </div>
        <input className="form-control" name={props.name} defaultValue={props.value} />
      </div>
  );
}


export const OptionsInputGroup = props => {
  return (
    props.reversed
      ? <div className="form-group input-group">
        <select
          className="custom-select"
          id={props.id}
          name={props.name}
          defaultValue={props.value}>{props.options}
        </select>
        <div className="input-group-append">
          <span className="input-group-text">{props.hint}</span>
        </div>
      </div>
      : <div className="form-group input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.hint}</span>
        </div>
        <select
          className="custom-select"
          id={props.id}
          name={props.name}
          defaultValue={props.value}>{props.options}
        </select>
      </div>
  );
}


export const Loading = props => {
  return <img alt="Loading..." src="ajax_loader.gif" height={70} />;
}


export class CustomInputGroup extends PureComponent {

  render() {
    return (
      <div className="form-group input-group" id={this.props.id}>
        <div className="input-group-prepend">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => this.props.removeInputGroup(this.props.id)}
          >-</button>
        </div>
        <select
          className="custom-select"
          name={this.props.name}
          defaultValue={this.props.value}
        >{this.props.options}</select>
        <div className="input-group-append">
          <span className="input-group-text">{this.props.hint}</span>
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={this.props.addInputGroup}
          >+</button>
        </div>
      </div>
    );
  }
}


export default ModalExample;