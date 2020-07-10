import moment from 'moment';



export const blink = async (message, bad = false) => {
  let popup = document.getElementById("message");

  if (bad)
    popup.classList.replace("text-success", "text-danger");

  popup.innerText = message;
  popup.style.opacity = 1;

  setTimeout(() => {
    popup.style.opacity = 0;
    setTimeout(() => popup.classList.replace("text-danger", "text-success"), 500);
  }, bad ? 4000 : 2000);
}



export const errorHandler = (data) => {
  let errors = [];
  for (let er in data.errors)
    errors.push(data.errors[er]);

  errors = errors.join("\n");
  return errors;
}



export const log = (module, data) => {
  console.log(module.displayName, data);
}



export const bring = async (source) => {
  let request = source.map(s => fetch(`api/${s}`));

  let response = await Promise.all(request)
    .catch(response => response.json()
      .then(error => { throw new Error(error) }))

  let data = await Promise.all(response.map(res => res.json()));
  let result = new Map();
  for (let i = 0; i < source.length; ++i)
    result.set(source[i], data[i])

  return result;
}



export const correctDate = str => {
  let date = new Date(str);
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}



export const datesDiff = (begin, end) => moment(end).diff(moment(begin), 'days');



export const keyGen = () => Math.floor(Math.random() * 10000);