
export let blink = async (message, bad = false) => {
    let popup = document.getElementById("message");

    if (bad)
        popup.classList.replace("text-success", "text-danger");

    popup.innerText = message;
    popup.style.opacity = 1;

    setTimeout(() => {
        popup.style.opacity = 0;
        setTimeout(() => popup.classList.replace("text-danger", "text-success"), 500);
    }, 2000);
}