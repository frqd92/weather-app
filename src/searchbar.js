import { elementCreator } from "./utils/elementCreator";
const resultsCont = document.querySelector(".search-results-container")

export function searchFunc(){
    const input = document.getElementById("search-input");
    input.addEventListener("input", inputSearch);
}

function inputSearch(){
    resultsCont.querySelectorAll("div").forEach(child=>child.remove())
    if(this.value.length>0){
        resultsCont.classList.add("search-results-show")
        const resultPromise = searchCitiesCountries(this.value);
        
    }
    else{
        resultsCont.classList.remove("search-results-show")

    }
}
async function searchCitiesCountries(inputValue){
    inputValue = formatSearchInput(inputValue)
    try{
        const fetchValue = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities/')
        const fetchJson = await fetchValue.json();
        const foundValues = fetchJson.data.filter((value, index)=>{
            const cityCountry = value.city + " " + value.country;
            const countryCity = value.country + " " + value.city;
            if(formatSearchInput(cityCountry).includes(inputValue) || formatSearchInput(countryCity).includes(inputValue)){
                if(value.city==="based" || value.city==="null" ) return
                return value
            }
        }).slice(-20)
        foundValues.forEach(val=>{
            const row = searchRowFact(val);
        })
        if(foundValues.length<1){
            throw new Error("No values found...")
        }
    }
    catch (error){}
}

function formatSearchInput(val){
    return val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[\s]/g, "");
}

function searchRowFact(val){
    const container = elementCreator("div", ["class", "search-row-cont"], false, resultsCont )
    const city = elementCreator("p", false, val.city + ",", container)
    const country = elementCreator("p", false, val.country, container)
    
    return container;
}
