$(document).ready(function() {
  var baseURL = 'http://api.openweathermap.org/data/2.5/';
  var APIKey = 'b410fc5f2eddb93c3ef96ea535fd95ee';
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;
      $.getJSON(
        baseURL + 'forecast?lat=' + lat + '&lon=' + lng + '&appid=' + APIKey,
        function(data) {
          var citySet = data.city;
          var dataList = data.list;

          $('#currCity').html(citySet.name);
          $('#currCountry').html(citySet.country);
          var i = 0,
            len = dataList.length;
          for (; i < len; i++) {
            var date = moment(dataList[i].dt_txt).format(
              'dddd, MMM Do YY, h:mm a'
            );
            var temp = '<div class="weather-card">';
            temp += '<div class="card-header">' + date + '</div>';
            temp +=
              '<div><img src=' +
              'http://openweathermap.org/img/w/' +
              dataList[i].weather[0].icon +
              '.png' +
              '>' +
              dataList[i].weather[0].description +
              '</div>';
            temp += '<div>' + dataList[i].main.temp + ' °F </div>';
            temp += '<div>' + dataList[i].main.pressure + '</div>';
            temp += '<div>' + dataList[i].wind.speed + ' m/h </div></div>';
            $('.container').append(temp);
          }
        }
      );
    });
  }
  // $('.result').addClass('hide');
  // city wealth call
  $('#citySearch').click(function(e) {
    event.preventDefault();
    var city = $('#cityInput').val();
    $.ajax({
      url: baseURL + 'weather?q=' + city + '&appid=' + APIKey,
      dataType: 'json',
      type: 'GET',
      data: { q: city, appid: APIKey, units: 'imperial' },
      success: function(data) {
        // $('.result').removeClass('hide');
        var str = ' ',
          dCont = '';
        $.each(data.weather, function(index, val) {
          $('.cityName').html(data.name);
          $('.countryName').html(data.sys.country);
          dCont +=
            '<img src="http://openweathermap.org/img/w/' +
            val.icon +
            '.png"/> <b>' +
            data.main.temp +
            '&deg;F</b> | ' +
            val.main +
            ',' +
            val.description;
          str +=
            '<div class="row"><div class="col-6">Pressure</div><div class="col-6">' +
            data.main.pressure +
            ' hpa</div></div>';
          str +=
            '<div class="row"><div class="col-6">Humidity</div><div class="col-6">' +
            data.main.humidity +
            ' %</div></div>';
          str +=
            '<div class="row"><div class="col-6">Sunrise</div><div class="col-6">' +
            data.sys.sunrise +
            ' %</div></div>';
          str +=
            '<div class="row"><div class="col-6">Sunset</div><div class="col-6">' +
            data.sys.sunset +
            '</div></div>';
          str +=
            '<div class="row"><div class="col-6">Geo coords</div><div class="col-6"> [' +
            data.coord.lat +
            ',' +
            data.coord.lon +
            ' ]</div></div>';
        });
        $('.table').html(str);
        $('.detailWeather').html(dCont);
        console.log(data);
      },
      fail: function(xhr, textStatus, errorThrown) {
        alert('request failed');
      },
      error: function(jqXHR, exception) {
        console.log(jqXHR.responseText);
        alert('City Not Fount');
      },
      statusCode: {
        404: function(request, status, error) {
          console.log('404 - Not Found');
          console.log(error);
        },
        503: function(request, status, error) {
          console.log('503 - Server Problem');
          console.log(error);
        }
      }
    });
  });
});
