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
    checkCityLocalStorage();
    const mainData = elementCreator("main", false, false, document.body);

})();

function checkCityLocalStorage(){
    const cityLocal = localStorage.getItem("city-choice");
    const choice = cityLocal===null?"Lisbon":cityLocal;
    localStorage.setItem("city-choice", choice);
    fetchData(choice);
}



