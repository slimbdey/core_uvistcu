
export let blink = async (message, bad = false) => {
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



export let errorHandler = (data) => {
    let errors = [];
    for (let er in data.errors)
        errors.push(data.errors[er]);

    errors = errors.join("\n");
    return errors;
}



export let log = (module, data) => {
    console.log(module.displayName, data);
}


export let bring = async (source) => {
    return await fetch(`api/${source}`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        }
    });
}