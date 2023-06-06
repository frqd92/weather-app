import { elementCreator, imageCreator } from "../utils/elementCreator";
import { bookmarkArr, changeCityChoice, globalUnit, writeBookmarked } from "../state";
import '/src/renderElements/cityHeader.css'
import '/src/renderElements/currentWeather.css'
import '/src/renderElements/contentBox.css'
import bookmark from '/src/assets/bookmark.svg'
import { changeTheme } from "./theme";

export async function fetchData(location){
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=063e821e951a4786b2d121448231605&q=${location}&days=7`;
   try{
        displayLoader(true)
        const weatherApi = await fetch(apiUrl);
        const weatherData = await weatherApi.json();

        displayLoader(false)
        renderCity(weatherData)
        changeCityChoice(location)
        if(localStorage.getItem("theme-time")===null){
            changeTheme(document.querySelector(".time-cont p").innerText);
        }
        else{
            changeTheme(localStorage.getItem("theme-time"))
        }

   }
   catch (error){
        fetchData(localStorage.getItem("city-choice"));
        noLocation(location)
   }
   

}
function displayLoader(bool){
    if(bool){
        const loaderCont = elementCreator("div", ["class", "loader-bg"], false, document.body);
        const loader = elementCreator("div", ["class", "lds-ring"], false, loaderCont);
        loader.innerHTML = '<div></div><div></div><div></div><div></div>'
    }
    else{
        document.querySelector(".loader-bg").remove()
    }
}

function noLocation(invalidLocation){
    if(document.querySelector(".input-error-div")!==null) return;
    const inputContainer = document.getElementById("input-container");
    const errorDiv = elementCreator("div", ["class", "input-error-div"], `'${invalidLocation}' not found...`, inputContainer)
    setTimeout(()=>{
        errorDiv.style.padding="0px";
        errorDiv.style.height="0px";
    },1000)
    setTimeout(()=>{
        errorDiv.remove();
    },1100)


}

function renderCity(data){
    const mainCont = document.querySelector("main");
    mainCont.querySelectorAll("div").forEach(elem=>elem.remove())
    const cityInfoContainer = createCityHeader(data, mainCont);
    const cityCurrentWeatherContainer = createCurrentCityWeather(data, mainCont)
    
    const hourlyBox = contentBoxFact("hourly weather", mainCont);
    fillHourly(hourlyBox, data);
    const moreInfo = contentBoxFact("more information", mainCont);
    fillInfo(moreInfo, data);



}


function fillHourly(parent, data){
    const contentBox = parent.querySelector(".content-box-content");
    const hourlyContainer = elementCreator("div", ["class", "hourly-cont"], false, contentBox);
    const leftArrow = elementCreator("div", ["class", "hourly-arrow"], "<", hourlyContainer);
    const squaresContainer = elementCreator("div", ["class", "hourly-squares-cont"], false, hourlyContainer);
    const rightArrow = elementCreator("div", ["class", "hourly-arrow"], ">", hourlyContainer);
    const currentHour = Number(document.querySelector(".time-cont").innerText.split(":")[0])
    leftArrow.addEventListener("click", scrollCont);
    rightArrow.addEventListener("click", scrollCont);
    function scrollCont(){
        const scrollFactor = this.innerText===">"?1:-1;
        const scrollVal = squaresContainer.scrollLeft;
        squaresContainer.scrollLeft = scrollVal + (950*scrollFactor);
    }

    //data
    const hourArr = data.forecast.forecastday[0].hour;
  
    hourArr.forEach(hour=>{
        const time = hour.time.split(" ")[1];
        const icon = hour.condition.icon;
        const tempDesc = hour.condition.text;
        const temp = hour[`temp_${globalUnit}`];
        hourlyFact(time,icon,tempDesc, temp)
    })

    function hourlyFact(time, icon, tempDesc, temp){
        const mainDiv = elementCreator("div", ["class", "hourly-square"], false, squaresContainer);
        const timeElem = elementCreator("span", false, time, mainDiv);
        const iconImg = imageCreator(icon, false, mainDiv);
        const tempElem = elementCreator("span", false, `${temp} °${globalUnit.toUpperCase()}`, mainDiv);
        const textDescElem = elementCreator("span", false, tempDesc, mainDiv);
        const squareHour = Number(time.split(":")[0])
        if(squareHour===currentHour){
            mainDiv.scrollIntoView({ behavior: "smooth", inline: "center" });
            mainDiv.classList.add("today-square")
        }
        
    }




}



function fillInfo(parent, data){
    const contentBox = parent.querySelector(".content-box-content");
    const windUnit = globalUnit==="c"?"kph":"mph";
    const visUnit = globalUnit==="c"?"km":"miles";
    const mainDiv = elementCreator("div", ["class", "more-information-div"], false, contentBox);
    //data
    const maxTemp = data.forecast.forecastday[0].day[`maxtemp_${globalUnit}`]+ " " + globalUnit.toUpperCase() + "°";
    const minTemp = data.forecast.forecastday[0].day[`mintemp_${globalUnit}`]+ " " + globalUnit.toUpperCase() + "°";
    const humidity = data.current.humidity + "%";
    const windDirection = data.current.wind_dir;
    const windSpeed = windDirection + " " + data.current[`wind_${windUnit}`] + " " + windUnit;
    const windGust = data.current[`gust_${windUnit}`] + " " + windUnit;
    const rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain + "%";
    const snowChance = data.forecast.forecastday[0].day.daily_chance_of_snow + "%";
    const visibility = data.current[`vis_${visUnit}`] + " " + visUnit;

    const uvIndex = data.current.uv;
    const pressure = data.current.pressure_mb + " mb";
    const contentArr = [maxTemp, minTemp, windSpeed, windGust,  rainChance, snowChance, humidity, visibility, uvIndex, pressure];
    const labels = ["Max temperature", "Min temperature", "Wind speed", "Wind gust",  "Chance of rain", "Chance of snow","Humidity", "Visibility", "UV index", "Pressure"]

    //elements
    for(let i=0;i<contentArr.length;i++){
        const container = elementCreator("div", ["class", "content-container"], false, mainDiv);
        elementCreator("p", false, labels[i], container);
        elementCreator("p", false, contentArr[i], container)
    }




}



function contentBoxFact(text, parent){
    const classN = text.split(" ")[0];
    const mainDiv = elementCreator("div", ["class", "content-box", `content-box-${classN}`], false, parent);
    const showHideBtnDiv = elementCreator("div", ["class", "show-hide-div"], false, mainDiv);
    let isShow = JSON.parse(localStorage.getItem(`${classN}-menu`)=== "true");
    const btnText = elementCreator("p", false, false, showHideBtnDiv);
    const arrow = elementCreator("span", false, "<", showHideBtnDiv);
    const contentDiv = elementCreator("div", ["class", "content-box-content"], false, mainDiv)
    checkMenuStatus()
    
    showHideBtnDiv.addEventListener("click", showHideBtnFunc)

    function showHideBtnFunc(){
        if(contentDiv.className.includes("shown")){
            isShow=false;
            contentDiv.classList.remove("content-shown")
            contentDiv.classList.add("content-hidden")
        }
        else{
            isShow=true;
            contentDiv.classList.remove("content-hidden")
            contentDiv.classList.add("content-shown")
        }
        localStorage.setItem(`${classN}-menu`, isShow);
        checkMenuStatus();
    }
    function checkMenuStatus(){
        const textPart = isShow?`Hide ${text}`:`Show ${text}`;
        const contentShow = isShow?"content-shown":"content-hidden"
        btnText.innerText = textPart;
        const arrowCl = isShow?"content-box-arrow-shown":"content-box-arrow-hidden";
        arrow.classList.remove(arrow.classList[0]);
        arrow.classList.add(arrowCl)
        contentDiv.classList.remove(contentDiv.classList[1]);
        contentDiv.classList.add(contentShow)
    }
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
    const bookmarkDiv = elementCreator("div", ["class", "bookmark-outer-div"], false, cityNameElem)
    const bookmarkBtn = elementCreator("div", ["class", "bookmark-div"], false, bookmarkDiv)
    const bookmarkImg = imageCreator(bookmark, ["class", "bookmark-svg"], bookmarkBtn);
    const checkmark = elementCreator("span", ["class", "bookmark-check"],"✓", bookmarkBtn )
    checkIfBookmarked();

    function checkIfBookmarked(){
        const local = localStorage.getItem("bookmarked-cities");
        if(!localStorage.getItem("bookmarked-cities").includes(cityName)){
            checkmark.classList.add("check-invisible")
        }
        else{
            bookmarkImg.classList.add("checked-bookmark-svg")
        }
    }



    bookmarkDiv.addEventListener("click", bookmarkCity)

    function bookmarkCity(){
        if(!bookmarkImg.className.includes("checked-bookmark-svg")){
            bookmarkImg.classList.add("checked-bookmark-svg")
            checkmark.classList.remove("check-invisible");
            writeBookmarked(cityName, true)
        }
        else{
            bookmarkImg.classList.remove("checked-bookmark-svg")
            checkmark.classList.add("check-invisible")
            writeBookmarked(cityName, false)
        }

    }
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