import { elementCreator, imageCreator } from "../utils/elementCreator";
import { changeCityChoice, globalUnit } from "../state";
import '/src/renderElements/cityHeader.css'
import '/src/renderElements/currentWeather.css'


export async function fetchData(location){
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=063e821e951a4786b2d121448231605&q=${location}&days=3`;
   try{
        const weatherApi = await fetch(apiUrl);
        const weatherData = await weatherApi.json();
        renderCity(weatherData)
        changeCityChoice(location)
   }
   catch (error){
        console.log(error);
        console.log("Location not found");
   }
   

}


function renderCity(data){
    const mainCont = document.querySelector("main");
    mainCont.querySelectorAll("div").forEach(elem=>elem.remove())
    const cityInfoContainer = createCityHeader(data, mainCont);
    const cityCurrentWeatherContainer = createCurrentCityWeather(data, mainCont)
}

function contentBoxFact(text){
    const mainDiv = elementCreator("div", ["class", "content-box", `content-box-${text.split(" ")[0]}`], false, false);
    return mainDiv;
}





function createCurrentCityWeather(data, mainCont){
    // current weather
    const iconUrl = data.current.condition.icon;
    const unit = globalUnit.toUpperCase();
    const currentWeather = data.current[`temp_${globalUnit}`];

    const currentWeatherDiv = elementCreator("div", ["class", "current-weather-div"], false, mainCont)
    const weatherContainer = elementCreator("div", ["class", "current-weather-cont"], false, currentWeatherDiv)
    const weatherIcon = imageCreator(iconUrl, false, weatherContainer);
    
    const weatherPart = elementCreator("div",  ["class", "current-weather-part"], false, weatherContainer)
    const weatherAndUnit = elementCreator("div", ["class", "current-weather-unit"], false, weatherPart)
    const createCurrentWeather = elementCreator("p", false, `${currentWeather}°`, weatherAndUnit);
    const weatherUnit = elementCreator("span", false, unit, weatherAndUnit);
    const feelsLike = elementCreator("p", false, "Feels like " + data.current[`feelslike_${globalUnit}`] + "°" + unit, weatherPart)
    const weatherDescription = elementCreator("p", false, data.current.condition.text, weatherPart)

    // sunrise/sunset
    const sunriseData = data.forecast.forecastday[0].astro.sunrise;
    const sunsetData = data.forecast.forecastday[0].astro.sunset;
    const astroPart = elementCreator("div", ["class", "current-weather-astro"], false, currentWeatherDiv)
    const [sunriseIcon, sunsetIcon] = createAstroIcons();
    const sunriseDiv = elementCreator("div", ["class", "sunrise-div"], false, astroPart);
    elementCreator("p", false, "Sunrise at " + sunriseData, sunriseDiv)
    sunriseDiv.appendChild(sunriseIcon);
    const sunsetDiv = elementCreator("div", ["class", "sunset-div"], false, astroPart);
    sunsetDiv.appendChild(sunsetIcon);
    elementCreator("p", false, "Sunset at "+sunsetData , sunsetDiv)



    return currentWeatherDiv
}

function createAstroIcons(){
    const iconArr = [];
    for(let i=0;i<2;i++){
        const className = i===0?"sunrise":"sunset";
        const mainDiv = elementCreator("div", ["class", "astro-main-div"], false, false)
        const sun = elementCreator("div", ["class", "astro-sun", `astro-sun-${className}`], false, mainDiv)
        const arrow = elementCreator("div", ["class", "astro-sun-arrow", `astro-sun-arrow-${className}`], "⮕", sun)
        iconArr.push(mainDiv);
    }
    return iconArr
}




function createCityHeader(data, mainCont){
    const cityName = data.location.name;
    const countryName = data.location.country;
    const [cityDate, cityTime] = data.location.localtime.split(" ");
    const cityInfoCont = elementCreator("div", ["class", "city-info-cont"], false, mainCont)

    const cityDateElem = formatDate(cityDate, cityInfoCont);
    const cityNameElem = elementCreator("h1", false, cityName, cityInfoCont);
    const countryNameElem = elementCreator("h2", false, countryName, cityInfoCont);
    const cityTimeElem = formatTime(cityTime, cityInfoCont);
    return cityInfoCont
}


function formatTime(cityTime, div){
    const [hh,mm] = cityTime.split(":");
    const ss = new Date().getSeconds();
    const timeCont = elementCreator("div", ["class", "time-cont"], false, div)
    const hhElem = elementCreator("p", false, addZero(Number(hh)), timeCont)
    elementCreator("span", false, ":", timeCont);
    const mmElem = elementCreator("p", false, addZero(Number(mm)), timeCont);
    elementCreator("span", false, ":", timeCont);
    const ssElem = elementCreator("p", false, addZero(Number(ss)), timeCont)
    setInterval(()=>{
        ssElem.innerText = addZero(Number(ssElem.innerText) + 1);
        if(Number(ssElem.innerText)>59){
            ssElem.innerText = "00";
            mmElem.innerText = Number(mmElem.innerText)<60 ? addZero(Number(mmElem.innerText) + 1) : "00";
        }
        if(Number(mmElem.innerText)>59){
            mmElem.innerText = "00";
            hhElem.innerText = Number(hhElem.innerText)<24 ? addZero(Number(hhElem.innerText) + 1) : "00";
        }
    }, 1000)
    

    function addZero(elem){
        return Number(elem)<10?"0"+elem:elem;
    }
}








function formatDate(date, div){
    const [yy,mm,dd] = date.split("-");
    const str = `${addSuffix(dd)} of ${returnMonth(Number(mm))}, ${yy}`;
    return elementCreator("h3", false, str, div);

    function addSuffix(val){
        const num = Number(val);
        if(num===11 || num===12 || num===13 ){return num + "th"}
        else{
          const lastVal = Number(num.toString().split("").pop());
          switch(lastVal){
            case 1: return num + "st";
            case 2: return num + "nd";
            case 3: return num + "rd";
            default: return num + "th";
          }
        }
      }
      function returnMonth(month){
        const monthArr = ["January", "February", "March","April","May", "June", "July", "August", "September", "October", "November", "December"];
        if(isNaN(month)) return monthArr.indexOf(month);
        else return monthArr[month];
      }
}