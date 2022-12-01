const express = require("express");
const app = express();
const ejs = require("ejs");
const { Navigator } = require("node-navigator");
const navigator = new Navigator();
const fetch = require("node-fetch");
const PORT = process.env.PORT || 3030;

// api key
const myKey = "bc580dee07f04f0a2a5fa495d45e9e0c";

// k to cel
function ktoC(k) {
    return (k - 273.15).toFixed(1);
}

// middleware
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    navigator.geolocation.getCurrentPosition(async (success, error) => {
        if (error) console.error(error);
        else {
            console.log(success);
            let lat = success.latitude;
            let lon = success.longitude;
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${myKey}&lang=zh_tw`;
            let d = await fetch(url);
            let djs = await d.json();
            let { temp } = djs.main;
            let newTemp = ktoC(temp);
            let { feels_like } = djs.main;
            let newFeelsLike = ktoC(feels_like);
            let { temp_min } = djs.main;
            let newMin = ktoC(temp_min);
            let { temp_max } = djs.main;
            let newMax = ktoC(temp_max);
            let icon = djs.weather[0].icon;
            let weatherUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            res.render("index.ejs", {
                djs,
                newTemp,
                newFeelsLike,
                newMin,
                newMax,
                weatherUrl,
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
