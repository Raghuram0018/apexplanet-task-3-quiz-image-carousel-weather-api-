const url = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = '710f1987d13f2d09b5c7a146eec2dbca';

$(document).ready(function () {
	weatherFn('Noida'); // Set Noida as the initial city

	// Optional: Add input + button for user to search a city
	$('#search-btn').click(function () {
		const city = $('#city-input').val().trim();
		if (city) {
			weatherFn(city);
		}
	});
});

async function weatherFn(cName) {
	const apiUrl = `${url}?q=${cName}&appid=${apiKey}&units=metric`;
	try {
		const res = await fetch(apiUrl);
		const data = await res.json();
		if (res.ok) {
			weatherShowFn(data);
		} else {
			alert('City not found. Please try again.');
			$('#weather-info').hide();
		}
	} catch (error) {
		console.error('Error fetching weather data:', error);
		alert('Error fetching weather data. Please check your connection.');
	}
}

function weatherShowFn(data) {
	$('#city-name').text(data.name);
	$('#date').text(moment().format('MMMM Do YYYY, h:mm:ss a'));
	$('#temperature').html(`${Math.round(data.main.temp)}°C`);
	$('#description').text(data.weather[0].description);
	$('#wind-speed').html(`Wind Speed: ${data.wind.speed} m/s`);
	$('#weather-icon').attr(
		'src',
		`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
	);
	$('#weather-info').fadeIn();
}