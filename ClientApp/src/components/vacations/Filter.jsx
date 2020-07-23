import React from 'react';


export const Filter = props => {
  let emptyOption = <option key={0} value={0} onClick={() => props.applyFilter()}>- все -</option>;

  const userOptions = [emptyOption, ...props.users.map(u =>
    <option key={u.id} value={u.id} onClick={() => props.applyFilter()}>{u.fullName}</option>)];

  const officeOptions = [emptyOption, ...props.offices.map(o =>
    <option key={o.id} value={o.id} onClick={() => props.applyFilter()}>{o.name}</option>)];

  const deptOptions = [emptyOption, ...props.depts.map(d =>
    <option key={d.id} value={d.id} onClick={() => props.applyFilter()}>{d.name}</option>)];

  const yearOptions = [emptyOption, ...props.years.map(y =>
    <option key={y} value={y} onClick={() => props.applyFilter()}>{y}</option >)];



  const MySelect = props =>
    <div className="d-flex flex-column mr-2">
      <span className="small text-uppercase text-muted ml-1">{props.hint}</span>
      <select className="custom-select" id={props.id} defaultValue={props.value}>{props.options}</select>
    </div>



  return (
    <div className="d-flex flex-row">
      <MySelect hint="Отдел" options={deptOptions} value={props.deptId} id="deptId" />
      <MySelect hint="Бюро" options={officeOptions} value={props.officeId} id="officeId" />
      <MySelect hint="Работник" options={userOptions} value={props.userId} id="userId" />
      <MySelect hint="Год" options={yearOptions} value={props.year} id="year" />
      <div className="d-flex flex-column">
        <span className="small">&nbsp;</span>
        <div className="btn-group">
          <button type="button" className="btn btn-outline-success" onClick={props.applyFilter}>Применить</button>
          <button type="button" className="btn btn-outline-secondary" onClick={props.reset}>Сбросить</button>
        </div>
      </div>
    </div >
  );
}