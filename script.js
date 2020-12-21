// DOM Variables
var searchInput = $("#searchInput");

// Global Variables
var latitude;
var longitude;


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

    // $.ajax({
    //   url: oneTimeCallURL,
    //   method: "GET",
    // }).then(function (response) {
    //   console.log(response);
    // });

    $.ajax({
      url: currentWeatherURL,
      method: "GET",
    }).then(function (response) {
      results = response;
      console.log(response);
      latitude = results.coord.lat;
      longitude = results.coord.lon;

      var oneTimeCallURL =
        "https://api.openweathermap.org/data/2.5/onecall?lat=34.0289&lon=-84.1986&exclude=alerts,minutely,hourly,current&appid=" +
        APIkey +
        "&units=imperial";
    });
  }

  $("#searchButton").on("click", accessWeather);
});
