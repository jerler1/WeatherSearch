// DOM Variables
var searchInput = $("#searchInput");
var localStats = $("#localWeatherStats");

// Global Variables

$(document).ready(function () {
  function accessWeather(event) {
    event.preventDefault();
    var searchingFor = searchInput.val();
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

        //Displaying current weather on the page.

        //City Name
        var headingStats = $("<h2>").text(
          cityName + " " + "(" + readableDate + ")"
        );
        localStats.append(headingStats);

        //Temperature
        var currentTemp = $("<p>").text(
          "Temperature: " + results.main.temp + "°F"
        );
        localStats.append(currentTemp);

        //Humidity
        var currentHumidity = $("<p>").text(
          "Humidity: " + results.main.humidity
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
        console.log(indexUV);
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
      });
    });
  }

  $("#searchButton").on("click", accessWeather);
});
