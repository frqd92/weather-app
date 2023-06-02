import { unitPick } from './unitPicker';
import { searchFunc } from './searchbar';
import '/src/main.css'
import '/src/styles/header.css'
import '/src/assets/fonts/fonts.css'
import { fetchData } from './renderElements/renderCity';
import { elementCreator } from './utils/elementCreator';

countryApi()

async function countryApi(){

    try{
        const fetchValue = await fetch('http://geodb-free-service.wirefreethought.com/v1/geo/places?limit=10&offset=0', {
            method: 'GET',
          });
        
        const fetchJson = await fetchValue.json();
          console.log(fetchJson);

          
        const foundValues = fetchJson.data.filter((value, index)=>{
            
        })


    }
    catch (error){}
}



(()=>{
    unitPick();
    searchFunc();
    checkMenus();
    checkCityLocalStorage();
    const mainData = elementCreator("main", false, false, document.body);

})();

function checkCityLocalStorage(){
    const cityLocal = localStorage.getItem("city-choice");
    const choice = cityLocal===null?"Lisbon":cityLocal;
    localStorage.setItem("city-choice", choice);
    fetchData(choice);
}


function checkMenus(){
    const menuOptions = ["more", "hourly", "weekly"];
    menuOptions.forEach((option, index)=>{
        if(localStorage.getItem(`${option}-menu`)===null){
            let bool = true;
            if(index===0) bool = false;
            localStorage.setItem(`${option}-menu`, bool)
        }
    })
}