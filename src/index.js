import { unitPick } from './unitPicker';
import { searchFunc } from './searchbar';
import '/src/main.css'
import '/src/styles/header.css'
import '/src/assets/fonts/fonts.css'


(()=>{
    unitPick();
    searchFunc();
})();



function fetchData(location){
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=063e821e951a4786b2d121448231605&q=${location}&days=3`;
    

    fetch(apiUrl)
    .then(response=>{
        return response.json();
    })
    .then(data=>{
        console.log(data);
    })
    .catch(error=>{console.log(error);})
}

 

