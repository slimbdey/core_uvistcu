
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


export const bring = async (source, func) => {
  let error = "";

  let response = await fetch(`api/${source}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    }
  });

  let data = await response.json();
  response.ok
    ? func(data)
    : error += `${data}\n`;

  return error;
}


export const correctDate = str => {
  let date = new Date(str);
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
  let year = date.getFullYear();

  return `${day}.${month}.${year}`;
}