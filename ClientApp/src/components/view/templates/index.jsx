import React, { useState } from 'react';
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
      <input
        type="date"
        required
        className="form-control date"
        name={props.name}
        defaultValue={props.value && props.value.slice(0, 10)}
        onChange={props.onChange}
        min={props.min}
        max={props.max}
      />
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
        <input className="form-control" name={props.name} defaultValue={props.value} placeholder={props.placeholder} />
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


export const Loading = () => <img alt="Loading..." src="ajax_loader.gif" height={70} />


export const Calculating = props => <img alt="calculating..." src="calculating.gif" height={props.visible ? 30 : 0} />


export const CustomInputGroup = props => {
  return <div className="form-group input-group" id={props.id}>
    <div className="input-group-prepend">
      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={() => props.removeInputGroup(props.id)}
      >-</button>
    </div>
    <select
      className="custom-select"
      name={props.name}
      defaultValue={props.value}
    >{props.options}</select>
    <div className="input-group-append">
      <span className="input-group-text">{props.hint}</span>
      <button
        type="button"
        className="btn btn-outline-success"
        onClick={props.addInputGroup}
      >+</button>
    </div>
  </div>;
}



export const filter = props => {
  let emptyOption = <option key={0} value={0}>- все -</option>;

  const userOptions = [emptyOption, ...props.users.map(u =>
    <option key={u.id} value={u.id}>{u.fullName}</option>)];

  const officeOptions = [emptyOption, ...props.offices.map(o =>
    <option key={o.id} value={o.id}>{o.name}</option>)];

  const deptOptions = [emptyOption, ...props.depts.map(d =>
    <option key={d.id} value={d.id}>{d.name}</option>)];

  const yearOptions = [emptyOption, ...props.years.map(y =>
    <option key={y} value={y}>{y}</option >)];


  const MySelect = props =>
    <div className="d-flex flex-column mr-2">
      <span className="small text-uppercase text-muted ml-1">{props.hint}</span>
      <select
        className="custom-select custom-select-sm"
        id={props.id}
        defaultValue={props.value}
        onChange={() => props.action()}
      >{props.options}</select>
    </div>


  return (
    <div className="d-flex flex-row">
      <MySelect hint="Отдел" options={deptOptions} value={props.deptId} action={props.applyFilter} id="deptId" />
      <MySelect hint="Группа" options={officeOptions} value={props.officeId} action={props.applyFilter} id="officeId" />
      <MySelect hint="Работник" options={userOptions} value={props.userId} action={props.applyFilter} id="userId" />
      <MySelect hint="Год" options={yearOptions} value={props.year} action={props.applyFilter} id="year" />
      <div className="d-flex flex-column">
        <span className="small">&nbsp;</span>
        <div className="btn-group">
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={props.reset}>Сбросить</button>
        </div>
      </div>
    </div >
  );
}


export default ModalExample;