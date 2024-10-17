<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <h2 class="card-header text-center">WEATHER APP</h2>
        <div class="card-body">
          <form @submit.prevent="searchByCity">
            <div class="mb-3 search-bar">
              <input
                type="text"
                id="city-input"
                class="form-control"
                v-model="city"
                placeholder="Enter city name"
                required
              />
            </div>
            <div class="text-center">
              <button type="submit" class="btn btn-primary">Search</button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-md-12 text-center mt-4">
        <!-- If there are no data returned, then skip rendering the weather information -->
        <div v-if="weatherData">
          <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
          <div>
            <!-- The image source of the weather icon will be coming from the API response -->
            <img :src="iconUrl" alt="Weather Icon" />
            <p>{{ temperature }} °C</p>
          </div>
          <span>{{ weatherData.weather[0].description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importing axios for API requests
import axios from 'axios'

// Your API key for OpenWeatherMap (replace this with your actual API key)
const apikey = 'f68cad898ed653358aefda32b2ae868a'

export default {
  name: 'App',
  data() {
    return {
      city: '', // For storing the city input by the user
      weatherData: null // For storing fetched weather data
    }
  },
  computed: {
    // Converting temperature from Kelvin to Celsius
    temperature() {
      return this.weatherData
        ? Math.floor(this.weatherData.main.temp - 273.15) // OpenWeatherMap API returns temperature in Kelvin by default
        : null
    },
    // Creating a URL for the weather icon
    iconUrl() {
      return this.weatherData
        ? `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
        : null
    }
  },
  mounted() {
    // Fetching current location's weather when the component mounts
    this.fetchCurrentLocationWeather()
  },
  methods: {
    // Get weather by the user's current location
    async fetchCurrentLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`
          await this.fetchWeatherData(url)
        })
      }
    },
    // Get weather based on city input
    async searchByCity() {
      if (this.city.trim()) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`
        await this.fetchWeatherData(url)
      } else {
        alert('Please enter a valid city name')
      }
    },
    // Fetching weather data from the OpenWeather API
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url)
        this.weatherData = response.data
      } catch (error) {
        console.error('Error fetching weather data:', error)
      }
    }
  }
}
</script>
