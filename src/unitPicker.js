import { fetchData } from "./renderElements/renderCity";
import { globalUnit, changeGlobalUnit } from "./state";

export function unitPick(){
    checkLocalStorageForUnit();
    const unitBtns = document.querySelectorAll(".unit-choice")
    unitBtns.forEach(btn=>btn.addEventListener("click", chooseUnitClick))
}

function checkLocalStorageForUnit(){
    const localUnit = localStorage.getItem("unit");
    const value = localUnit?localUnit:"c";
    changeGlobalUnit(value);
    localStorage.setItem("unit", value)
    applyChosenUnit(value);
}

function chooseUnitClick(){
    const unitChoice = this.className.includes("celsius")?"c":"f";
    changeGlobalUnit(unitChoice);
    localStorage.setItem("unit", unitChoice);
    applyChosenUnit(unitChoice);
    rerenderPage()
}

function applyChosenUnit(unit){
    const unitBtns = document.querySelectorAll(".unit-choice");
    unitBtns.forEach(btn=>btn.classList.remove("chosen-unit"));
    const chosenBtn = unit==="c"?unitBtns[0]:unitBtns[1];
    chosenBtn.classList.add("chosen-unit")
    
}

function rerenderPage(){
    const lastCity = document.querySelector(".city-info-cont h1").innerText;
    fetchData(lastCity);
}