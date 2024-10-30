(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function updateDate() {
  const dateElement = document.getElementById("date");
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  const today = (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", options);
  dateElement.textContent = today;
}
async function updateWeather() {
  const locationElement = document.getElementById("location");
  const weatherElement = document.getElementById("weather");
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
    const { latitude, longitude } = position.coords;
    const apiKey = "940c1cc91d19d593d5546e088c9abc08";
    const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`);
    const weatherData = await weatherResponse.json();
    const city = weatherData.name;
    const temperature = weatherData.main.temp;
    const weatherDescription = weatherData.weather[0].description;
    locationElement.textContent = city;
    weatherElement.textContent = `${temperature}°C, ${weatherDescription}`;
  } catch (error) {
    locationElement.textContent = "Unable to get location";
    weatherElement.textContent = "Unable to get weather";
  }
}
updateDate();
updateWeather();
const linkEl = document.querySelector(".nav-list");
console.log(linkEl);
linkEl.addEventListener("click", function(event) {
  const selectedLink = event.target;
  selectedLink.classList.toggle("is-active");
});
