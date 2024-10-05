
// loading cities, longitude and latitude data from CSV file using Jquery AJAX  API call.
function loadCities() {
    var $citySelect = $("#citySelect");
    $.ajax({
        type: "GET",
        url: "city_coordinates.csv",
        dataType: "text",
        success: (lines) => {
            var rows = lines.split('\n');
            for (var i = 1; i < rows.length; i++) {
                var cols = rows[i].split(',');
                var optionValue = '{"lat":' + '\"' + cols[0] + '\"' + ',' + '"lon":' + '\"' + cols[1] + '\"' + '}';
                var cityCountryText = cols[2] + ", " + cols[3];
                $citySelect.append("<option value = " + optionValue + " >" + cityCountryText + "</option>");
            }
        }
    });
}

// loading City weather forecast to an external API using Jquery AJAX API call.
function loadCityWeatherForecast() {
    var $citySelect = $("#citySelect");
    var selectedCityValue = $citySelect.val();

    var $cityForecast = $("#cityForecast");
    var $resultsHeading = $("#get-results-heading");

    if (selectedCityValue == "") {
        $cityForecast.find('div').remove().end();
        return;
    }

    if (selectedCityValue != "") {
        $cityForecast.find('div').remove().end();
        $resultsHeading.append("<div class='spinner-border text-muted'></div>");
    }

    var cityCoordinates = JSON.parse(selectedCityValue);
    var externalUrl = 'https://www.7timer.info/bin/civillight.php?lon=' + cityCoordinates.lon + '&lat=' + cityCoordinates.lat + '&ac=0&unit=metric&output=json&tzshift=0';

    // Get call to an external API
    $.ajax({
        type: 'GET',
        url: externalUrl,
        dataType: 'text',
        success: (response) => {
            var weatherData = JSON.parse(response);
            if (weatherData != null) {
                $resultsHeading.find('div').remove().end();
                $cityForecast.find('div').remove().end();

                for (var i = 0; i < weatherData.dataseries.length; i++) {
                    var weatherDateString = "'" + weatherData.dataseries[i].date + "'";
                    var year = weatherDateString.substring(1, 5);
                    var month = weatherDateString.substring(5, 7);
                    var day = weatherDateString.substring(7, 9);
                    var weatherDate = new Date(year, month, day);

                    $cityForecast.append(
                        "<div class='col bm-2'><div class='card h-100'>" +
                        "<p class='weather-date'>" + weatherDate.toDateString() + "</p>" +
                        "<div class='weather-icon-div'><img class='weather-icon' src='images/"
                        + weatherData.dataseries[i].weather + ".png' alt='"
                        + weatherData.dataseries[i].weather + "'></div>" +
                        "<div class='card-body'>" +
                        "<p class='weather-description'>" + weatherData.dataseries[i].weather.toUpperCase() + "</p>" +
                        "<p class='weather-temperatures'>H:" + weatherData.dataseries[i].temp2m.max + "ºC</p>" +
                        "<p class='weather-temperatures'>L:" + weatherData.dataseries[i].temp2m.min + "ºC</p>" +
                        "</div>" +
                        "</div>" +
                        "</div>");
                }
            }
        }
    });
}
