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
        if(document.querySelector(".input-error-div"))document.querySelector(".input-error-div").remove()
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

    return container;
}




function closeInput(){
    const input = document.getElementById("search-input");
    input.value = "";
    resultsCont.classList.remove("search-results-show")
    if(document.querySelector(".result-child-cont")!==null) document.querySelector(".result-child-cont").remove()

}



function formatSearchInput(val){
    return val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[\s]/g, "");
}

