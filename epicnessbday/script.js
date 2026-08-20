let numButtonClicks = 0;
function buttonClicked() {
    numButtonClicks = numButtonClicks+1;
    if (numButtonClicks == 1) {
        document.getElementById("mainDiv").style.display = 'block';
        document.getElementById("body").style = 'background-image: url("mGNk19Zkt6UNG5AQzKdat59saKg=.jpg"); background-position: bottom right; background-attachment: fixed';
        document.getElementById("button").textContent = "I have read the message";
    }
    else {
    document.getElementById("button").textContent =
        "Well done! Now get back to work on Skype, if you worked as hard on it as you just did scrolling all the way back down to this button we'd have it by now 😤";
    }
}
