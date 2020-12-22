// DOM Variables
var searchInput = $("#searchInput");
var localStats = $("#localWeatherStats");
var futureForecast = $("#futureForecast");
var recentlyViewed = $("#recentlyViewed");

// Global Variables

$(document).ready(function () {
  // Getting data in local storage
  var recentCities = localStorage.getItem("recentCities");
  if (recentCities === null) {
    recentCities = [];
  } else {
    recentCities = JSON.parse(recentCities);
  }

  // Making recent searched cities list.
  for (let i = 0; i < recentCities.length; i++) {
    var recentDiv = $("<div>");
    recentDiv.attr("class", "col-sm-12 city recent");
    recentlyViewed.append(recentDiv);

    var recentP = $("<p>").text(recentCities[i]);
    recentP.attr("class", "my-auto py-2 px-3 cities");
    recentlyViewed.append(recentP);
  }

  function accessWeather(event, pastCity) {
    if (event !== null) {
      event.preventDefault();
    }
    if (pastCity === null || pastCity === undefined) {
      var searchingFor = searchInput.val();
    } else {
      searchingFor = pastCity;
    }
    // Making the search url..

    var APIkey = "f19a9ee9dc57acf95e7f4acab7f83b60";

    var currentWeatherURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      searchingFor +
      "&units=imperial&appid=" +
      APIkey;

    //Doing an API callfor current weather data
    $.ajax({
      url: currentWeatherURL,
      method: "GET",
    }).then(function (response) {
      results = response;
      console.log(response);

      var cityName = results.name;
      var latitude = results.coord.lat;
      var longitude = results.coord.lon;

      var oneTimeCallURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&exclude=alerts,minutely,hourly&appid=" +
        APIkey +
        "&units=imperial";

      //Doing an API call for one time call which requires data from the previous call.
      $.ajax({
        url: oneTimeCallURL,
        method: "GET",
      }).then(function (response) {
        var oneCallResult = response;
        console.log(oneCallResult);

        //Getting the date from the UNIX timestamp.

        //Converting time stamp to milliseconds
        var unixTimeStamp = results.dt * 1000;

        //Setting the milliseconds to make a new date that is usable.
        var unixDate = new Date(unixTimeStamp);

        //Formatting the date to how it should be displayed.
        var options = { month: "numeric", day: "numeric", year: "numeric" };
        var readableDate = unixDate.toLocaleString("en-US", options);

        // *** Current Weather ***
        localStats.empty();
        $("#localWeatherStats").attr("class", "localBorder py-2 my-2 px-2");

        // Weather Icon
        var iconCode = results.weather[0].icon;
        var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        var weatherImage = $("<img>");
        weatherImage.attr("src", iconURL);
        console.log(weatherImage);

        //City Name
        var headingStats = $("<h2>")
          .text(cityName + " " + "(" + readableDate + ")")
          .append(weatherImage);

        localStats.append(headingStats);

        //Temperature
        var currentTemp = $("<p>").text(
          "Temperature: " + results.main.temp + "°F"
        );
        localStats.append(currentTemp);

        //Humidity
        var currentHumidity = $("<p>").text(
          "Humidity: " + results.main.humidity + "%"
        );
        localStats.append(currentHumidity);

        //Wind Speed
        var currentWind = $("<p>").text(
          "Wind Speed: " + results.wind.speed + " MPH"
        );
        localStats.append(currentWind);

        //UV Index
        var indexUV = oneCallResult.daily[0].uvi;
        var currentUV = $("<p>UV Index: </p>");

        //Forcing the currentUV and numUV elements to be on the same line.
        currentUV.attr("style", "display:inline-block");
        var numUV = $("<span>").text(indexUV);

        //Changing the background of the span to be a certain color if the UV is in certain ranges.
        if (indexUV <= 2) {
          numUV.attr("style", "background-color: green");
        } else if (indexUV >= 2 && indexUV <= 6) {
          numUV.attr("style", "background-color: yellow");
        } else {
          numUV.attr("style", "background-color: red");
        }
        localStats.append(currentUV);
        localStats.append(numUV);

        // *** Future Forecast section ***
        $("#futureHeading").empty();
        var futureHeading = $("<h3>").text("5-Day Forecast:");
        futureHeading.attr("style", "background-color: white");
        $("#futureHeading").append(futureHeading);

        // Iterating over future forecast array
        futureForecast.empty();
        for (let i = 1; i < oneCallResult.daily.length - 2; i++) {
          // Making the card.
          var cardDiv = $("<div>");
          cardDiv.attr("class", "card bg-custom mx-4 mb-2");
          cardDiv.attr("style", "width: 170px");
          futureForecast.append(cardDiv);

          // Making the card body.
          var cardBody = $("<div>");
          cardBody.attr("class", "card-body");
          cardDiv.append(cardBody);

          // Making the date.
          unixTimeStamp = oneCallResult.daily[i].dt * 1000;
          unixDate = new Date(unixTimeStamp);
          readableDate = unixDate.toLocaleString("en-US", options);
          var cardHeading = $("<h4>").text(readableDate);
          cardDiv.append(cardHeading);

          // Making the icon.
          var futureIcon = $("<img>");
          var iconCode = oneCallResult.daily[i].weather[0].icon;
          var iconURL =
            "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";
          futureIcon.attr("src", iconURL);
          cardDiv.append(futureIcon);

          // Acquiring Temperature
          var futureTemp = $("<p>").text(
            "Temp: " + oneCallResult.daily[i].temp.day + " °F"
          );
          cardDiv.append(futureTemp);

          // Acquiring Humidity
          var futureHumidity = $("<p>").text(
            "Humidity: " + oneCallResult.daily[i].humidity + "%"
          );
          cardDiv.append(futureHumidity);
        }

        // Storing data in local storage
        var recentCities = localStorage.getItem("recentCities");
        if (recentCities === null) {
          recentCities = [];
        } else {
          recentCities = JSON.parse(recentCities);
        }

        // Putting the new city in the front of the array and clearing duplicates.
        recentCities.unshift(cityName);
        recentCities = [...new Set(recentCities)];

        // Making recent searched cities list.
        recentlyViewed.empty();
        for (let i = 0; i < recentCities.length; i++) {
          var recentDiv = $("<div>");
          recentDiv.attr("class", "col-sm-12 city recent");
          recentlyViewed.append(recentDiv);

          var recentP = $("<p>").text(recentCities[i]);
          recentP.attr("class", "my-auto py-2 px-3 cities");
          recentlyViewed.append(recentP);
        }

        localStorage.setItem("recentCities", JSON.stringify(recentCities));
      });
    });
  }

  $("#searchButton").on("click", accessWeather);
  recentlyViewed.on("click", ".cities", function (event) {
    console.log($(this).text());
    accessWeather(null, $(this).text());
  });
});
