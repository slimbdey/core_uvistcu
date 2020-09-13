import moment from 'moment';
import monthWeights from '../vacations/MonthWeights.json';



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
  //.catch(response => response.json()
  //  .then(error => { throw new Error(error) }))

  let data = await Promise.all(response.map(res => res.json()));
  let result = new Map();
  for (let i = 0; i < source.length; ++i)
    result.set(source[i], data[i])

  return new Promise(resolve => resolve(result));
}



export const correctDate = str => {
  let date = new Date(str);
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}



export const datesDiff = (begin, end) => moment(end).diff(moment(begin), 'days');



export const keyGen = () => Math.floor(Math.random() * 1000000);



export const calculateRating = (users, vacations, year) => {

  const fillYearRanks = k => {
    let year = {};
    for (let i = 1; i < 13; ++i)
      year[i] = monthWeights[i] * k;
    return year;
  }

  let yearRanks = {};
  yearRanks[year] = fillYearRanks(1);
  yearRanks[year - 1] = fillYearRanks(0.7);
  yearRanks[year - 2] = fillYearRanks(0.5);

  let scoreVacation = {};
  vacations.forEach(v => {
    const vMonth = moment(v.beginDate).month() + 1;
    const vYear = moment(v.beginDate).year();

    v.score = yearRanks[vYear][vMonth] * (datesDiff(v.beginDate, v.endDate) + 1);

    if (!scoreVacation[vYear])
      scoreVacation[vYear] = {};

    if (!scoreVacation[vYear][v.userId])
      scoreVacation[vYear][v.userId] = 0;

    scoreVacation[vYear][v.userId] += v.score;
  });

  for (let year in scoreVacation) {
    let values = Object.values(scoreVacation[year]);
    const avg = values.reduce((p, c) => p + c, 0) / values.length;

    users.forEach(u => {
      if (!scoreVacation[year][u.id])
        scoreVacation[year][u.id] = avg;
    });
  }

  let years = Object.keys(yearRanks);
  users.forEach(usr => usr.vacationRating = scoreVacation[years[0]][usr.id] + scoreVacation[years[1]][usr.id] + scoreVacation[years[2]][usr.id]);
}


export const round = num => Math.floor(num * 10) / 10;


export const getCookie = name => {
  let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}


export const setCookie = (name, value, options = {}) => {
  options = {
    path: '/',
    sameSite: 'lax',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}


export const deleteCookie = name => {
  setCookie(name, "", {
    'max-age': -1
  })
}