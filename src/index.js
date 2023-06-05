import { unitPick } from './unitPicker';
import { searchFunc } from './searchbar';
import '/src/main.css'
import '/src/styles/header.css'
import '/src/assets/fonts/fonts.css'
import { fetchData } from './renderElements/renderCity';
import { elementCreator} from './utils/elementCreator';
import { followMouseHoverText } from './utils/followMouse';
import { bookmarkArr, equateBookmark, readBookmarked, writeBookmarked } from './state';
import { themeFunc } from './renderElements/theme';


(()=>{
    unitPick();
    searchFunc();
    checkMenus();
    checkCityLocalStorage();
    bookmarkHeaderFunc();
    themeFunc()
    const mainData = elementCreator("main", false, false, document.body);

})();



function bookmarkHeaderFunc(){
    if(readBookmarked()===null){
        localStorage.setItem("bookmarked-cities", JSON.stringify([]));
    }

    else if(readBookmarked().length>0){
        equateBookmark(localStorage.getItem("bookmarked-cities"))
    }
 
    const bookmarkCont = document.getElementById("bookmark-menu-container");
    const menu = bookmarkCont.querySelector(".bookmark-menu");
    const bookmarkBtn = bookmarkCont.querySelector("svg");
    followMouseHoverText(bookmarkBtn, "Bookmarked cities")

    bookmarkCont.addEventListener("click", showHide);
    function showHide(e){
        if(!menu.className.includes("bookmark-menu-show")){
            menu.classList.add("bookmark-menu-show");
            document.addEventListener("click", hideFromOut)
            fillBookmarks();
        }
        else{
            if(!e.target.closest(".bookmark-menu")){
                closeMenu()
            }
        }
    }
    function closeMenu(){
        menu.classList.remove("bookmark-menu-show");
        document.removeEventListener("click", hideFromOut)
        menu.querySelector("div").remove()
    }
    function fillBookmarks(){
        if(bookmarkArr.length<1){
            elementCreator("div", ["class", "empty-bookmark"], "No bookmarked cities", menu)
        }
        else{
            const bookmarkDiv = elementCreator("div", ["class", "bookmarked-row-div"], false, menu);
            bookmarkArr.forEach(elem=>{
                const row = elementCreator("div", ["class", "bookmarked-row"], false, bookmarkDiv);
                const cityBtn = elementCreator("p", false, elem, row);
                const dltRow = elementCreator("span", false, "Del", row);


                cityBtn.addEventListener("click", ()=>{
                    fetchData(elem)
                })
                dltRow.addEventListener("click", ()=>{
                    writeBookmarked(elem, false)
                    closeMenu()
                    const bookmarkImg = document.querySelector(".bookmark-div img");
                    const check = document.querySelector(".bookmark-div span");
                    bookmarkImg.classList.remove("checked-bookmark-svg")
                    check.classList.add("check-invisible")
                })
            })
        }
    }

    function hideFromOut(e){
        if(!e.target.closest("#bookmark-menu-container")){
            menu.classList.remove("bookmark-menu-show");
            menu.querySelector("div").remove()
            document.removeEventListener("click", hideFromOut)
        }
    }


}


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

