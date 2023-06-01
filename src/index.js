import { unitPick } from './unitPicker';
import { searchFunc } from './searchbar';
import '/src/main.css'
import '/src/styles/header.css'
import '/src/assets/fonts/fonts.css'
import { fetchData } from './renderElements/renderCity';
import { elementCreator } from './utils/elementCreator';


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
            localStorage.setItem(`${option}-menu`, true)
        }
    })
}