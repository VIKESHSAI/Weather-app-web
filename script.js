const apiKey = "0e398415e1aadf3fa116e17518080c3f";

let forecastData = [];

window.onload = () => {
  const city = localStorage.getItem("city") || "Bangalore";

  if (document.getElementById("temp")) {
    getWeather(city);
    getToday(city);
  }

  if (document.getElementById("forecast")) {
    getForecast(city);
  }
};

function searchCity() {
  const city = document.getElementById("cityInput").value;
  localStorage.setItem("city", city);

  getWeather(city);
  getToday(city);
}


async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const d = await res.json();

  document.getElementById("temp").innerText = d.main.temp + "°C";
  document.getElementById("desc").innerText = d.weather[0].description;
  document.getElementById("location").innerText = d.name;

  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`;

  document.getElementById("condition").innerText = d.weather[0].main;
  document.getElementById("humidity").innerText = d.main.humidity;
}


async function getToday(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const d = await res.json();

  const box = document.getElementById("todayForecast");
  if (!box) return;

  box.innerHTML = "";

  d.list.slice(0, 3).forEach((i) => {
    box.innerHTML += `
      <p>⏰ ${i.dt_txt.split(" ")[1]} → ${Math.round(i.main.temp)}°C</p>
    `;
  });
}


async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const d = await res.json();

  forecastData = d.list
    .filter((i) => i.dt_txt.includes("12:00:00"))
    .slice(0, 4);

  const box = document.getElementById("forecast");
  box.innerHTML = "";

  forecastData.forEach((day, i) => {
    box.innerHTML += `
      <div class="day" onclick="openModal(${i})">

        <h4>${new Date(day.dt_txt).toDateString().slice(0, 3)}</h4>

        🌡 ${Math.round(day.main.temp)}°C <br>
        💧 ${day.main.humidity}% <br>
        ☁ ${day.clouds.all}% <br>
        👁 ${day.visibility / 1000} km <br>
        💨 ${day.wind.speed} km/h <br>

      </div>
    `;
  });
}


function openModal(i) {
  const d = forecastData[i];

  document.getElementById("modal").style.display = "flex";

  document.getElementById("mDate").innerText = new Date(
    d.dt_txt,
  ).toDateString();

  document.getElementById("details").innerHTML = `
    🌡 Temp: ${Math.round(d.main.temp)}°C <br>
    💧 Humidity: ${d.main.humidity}% <br>
    ☁ Cloud: ${d.clouds.all}% <br>
    👁 Visibility: ${d.visibility / 1000} km <br>
    💨 Wind: ${d.wind.speed} km/h <br>
    ⏱ Last Updated: ${d.dt_txt}
  `;
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
