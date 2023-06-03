import { fetchData } from "./renderElements/renderCity";
import { globalUnit } from "./state";
import { elementCreator } from "./utils/elementCreator";
const resultsCont = document.querySelector(".search-results-container")

export function searchFunc(){
    const input = document.getElementById("search-input");
    input.addEventListener("input", inputSearch);
    input.addEventListener("keydown", inputValidate)
}

function inputValidate(e){
    if(e.code==="Enter" && this.value.length>0){
        fetchData(this.value)
        closeInput()
    }
}

function inputSearch(){
    if(this.value.length>0){
        resultsCont.classList.add("search-results-show");
        const resultPromise = searchCitiesCountry(this.value)

    }
    else{
        resultsCont.classList.remove("search-results-show")
        document.querySelector(".result-child-cont").remove()
    }
}


async function searchCitiesCountry(inputValue){
    try{
        const fetchValue = await fetch(`http://geodb-free-service.wirefreethought.com/v1/geo/places?limit=10&offset=0&namePrefix=${inputValue}&sort=-population,name`, {
            method: 'GET',
          });
        
        const fetchJSON = await fetchValue.json();
        const placeArr = fetchJSON.data;
        const parentCont = resultsContFunc()
        placeArr.forEach(place=>{
            searchRowFact(place.name, place.country, parentCont)
        })


    }
    catch (error){}
}

function resultsContFunc(){
    if(document.querySelector(".result-child-cont")!==null){
        document.querySelector(".result-child-cont").remove()
    }
    return elementCreator("div", ["class", "result-child-cont"], false, resultsCont)
}
async function searchRowFact(city, country, parentCont){
    const container = elementCreator("div", ["class", "search-row-cont"], false, parentCont )
    const cityElem = elementCreator("p", false, city + ",", container)
    const countryElem = elementCreator("p", false, country, container)

    container.addEventListener("click", ()=>{
        fetchData(city);
        closeInput();
    })
    try{
        const cityWeatherObj = await searchMenuWeather(cityElem.innerText);
        let cityWeather = cityWeatherObj.current[`temp_${globalUnit}`];
        cityWeather = !cityWeather.toString().includes(".")?cityWeather+".0":cityWeather;
        const weatherElem = elementCreator("div", ["class", "search-row-weather"], cityWeather + "°" +globalUnit.toUpperCase() , container)
    
    }
    catch(error){

    }

    return container;
}

async function searchMenuWeather(city){
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=063e821e951a4786b2d121448231605&q=${city}&days=7`;
    try{
        const fetchObj = await fetch(apiUrl)
        return await fetchObj.json();
    }
    catch(error){

    }
}



function closeInput(){
    const input = document.getElementById("search-input");
    input.value = "";
    resultsCont.classList.remove("search-results-show")
    document.querySelector(".result-child-cont").remove()

}



function formatSearchInput(val){
    return val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[\s]/g, "");
}

