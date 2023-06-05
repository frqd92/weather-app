import { changeThemeStorage } from "../state";
import { elementCreator, imageCreator } from "../utils/elementCreator";
import { followMouseHoverText } from "../utils/followMouse";
import themeIcon from '/src/assets/theme.png'
import '/src/styles/themePick.css'

export function themeFunc(){
    const themeCont = document.getElementById("theme-container");
    const themeImg = imageCreator(themeIcon, ["id", "theme-icon"], themeCont)
    const themeMenu = elementCreator("div", ["class", "theme-menu"], false, themeCont)
    followMouseHoverText(themeImg, "Background")
    autoFunc(themeMenu)
    sliderFunc(themeMenu)


    
    themeImg.addEventListener("click", ()=>{
        if(document.querySelector(".city-info-cont")===null) return
        if(!themeMenu.className.includes("theme-menu-show")){
            themeMenu.classList.add("theme-menu-show");
            setTimeout(()=>{
                if(localStorage.getItem("theme-time")===null){
                    findSliderPosition();
                }
                else{
                    findSliderPosition(Number(localStorage.getItem("theme-time"))+1);
                }
            }, 165)
            
        }
        else{
            themeMenu.classList.remove("theme-menu-show");
        }
    })

}
function autoFunc(themeMenu){
    const autoDiv = elementCreator("div", ["class", "theme-auto"], false, themeMenu);
    const label = elementCreator("span", false, "AUTO", autoDiv)
    const checkDiv = elementCreator("div", false, false, autoDiv)
    const innerCheck = elementCreator("span", ["class", "theme-check"], "✓", checkDiv);

    if(localStorage.getItem("theme-time")!==null){
        innerCheck.classList.add("hide-check");
    }
    else{
        

    }
    autoDiv.addEventListener("click", autoSelect)

    function autoSelect(){
        if(!innerCheck.className.includes("hide-check")){
            innerCheck.classList.add("hide-check");
        }
        else{
            innerCheck.classList.remove("hide-check");
            findSliderPosition()
        }
    }
}


function disableThemeAuto(){
    document.querySelector(".theme-check").classList.add("hide-check")

}


function sliderFunc(themeMenu){
    const sliderCont = elementCreator("div", ["class", "slider-cont"], false, themeMenu)
    const sliderLine = elementCreator("div", ["class", "slider-line"], false, sliderCont) 
    const thumb = elementCreator("div", ["class", "slider-thumb"], false, sliderCont)
    const thumbTimeDisp = elementCreator("div", ["class", "slider-time-disp"], false, sliderCont)

    let isDragging = false;
    let offsetY = 0;


    thumb.addEventListener("mouseover", showDisp);
    thumb.addEventListener("mouseleave", hideDisp);
    sliderCont.addEventListener("mousedown", moveThumbCont)

    function moveThumbCont(e){
        disableThemeAuto()
        if(e.target===thumb) return;
        const sliderTop = sliderCont.getBoundingClientRect().top
        let pos = Math.floor(e.clientY - sliderTop);
        thumb.style.top = pos + "px"


    }
    function showDisp(){
        if(!thumbTimeDisp.className.includes("slider-time-disp-show")){
            thumbTimeDisp.classList.add("slider-time-disp-show")
        }
        const thumbPos = parseInt(getComputedStyle(thumb).top);
        thumbTimeDisp.style.top = (thumbPos - 10) + "px"

        const thumbHeight = parseInt(getComputedStyle(thumb).height)
        const sliderContTop = parseInt(getComputedStyle(sliderCont).height)
        const maxThumbHeight = sliderContTop- thumbHeight;
        let finalSlidePos = Math.floor((thumbPos/maxThumbHeight)*23)
        if(finalSlidePos===0){finalSlidePos = "midnight";}
        else if(finalSlidePos===12){finalSlidePos = "noon"}
        else if(finalSlidePos>12){finalSlidePos = (finalSlidePos-12) + "pm";}
        else{finalSlidePos += "am";}
        thumbTimeDisp.innerText = finalSlidePos
    }

    function hideDisp(){
        thumbTimeDisp.classList.remove("slider-time-disp-show")
    }

    thumb.addEventListener('mousedown', startDragging);
    thumb.addEventListener('touchstart', startDragging);
    document.addEventListener('mouseup', stopDragging);
    document.addEventListener('touchend', stopDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    function startDragging(e){
        e.preventDefault();
        isDragging = true;
        offsetY = e.clientY || e.touches[0].clientY;
        thumb.style.cursor = 'grabbing';
    }
    
    function stopDragging(e){
        if(!e.target.closest(".slider-cont")) return
        console.log("shart");
        isDragging = false;
        thumb.style.cursor = 'grab';
        hideDisp()
        const val = formatForTheme(thumbTimeDisp.innerText)
        changeThemeStorage(val)

    }
    let prevDrag;
    function drag(e){
        if (!isDragging) return;
        e.preventDefault();
        const currentY = e.clientY || (e.touches && e.touches.length > 0 ? e.touches[0].clientY : 0);
        const deltaY = currentY - offsetY;
        const containerHeight = sliderCont.offsetHeight;
        const thumbHeight = thumb.offsetHeight;
        const minThumbY = 0;
        const maxThumbY = containerHeight - thumbHeight;
        let newY = thumb.offsetTop + deltaY;

        if(newY < minThumbY){newY = minThumbY };
        if(newY > maxThumbY){ newY = maxThumbY}; 
        thumb.style.top = `${newY}px`;
        offsetY = currentY;
        const percentage = Math.floor((((maxThumbY - newY)/maxThumbY)*100));
        const finalVal = Math.floor((23*percentage)/100);
        showDisp()
        if(prevDrag!==undefined){
            if(finalVal!==prevDrag){
                changeTheme(document.querySelector(".slider-time-disp").innerText)

            }
        }
        prevDrag = finalVal;
    }
}

export function findSliderPosition(val){
    const pageTime = Number(document.querySelector(".time-cont p").innerText)+1;
    const thumb = document.querySelector(".slider-thumb");
    const sliderCont = document.querySelector(".slider-cont");
    const thumbHeight = parseInt(getComputedStyle(thumb).height)
    const sliderContTop = parseInt(getComputedStyle(sliderCont).height)
    const maxThumbHeight = sliderContTop- thumbHeight;
    const thumbTop = parseInt(getComputedStyle(thumb).top)
    let time = !val ? pageTime : val;
    const sliderPos = (maxThumbHeight*time)/23
    thumb.style.top = sliderPos + "px";
}


function formatForTheme(val){
    if(val.length<1) return;
    if(val==="midnight") val = 0
    else if(val==="noon") val = 12;
    else{
        if(val.includes("pm")) val = parseInt(val) + 12;
        else val = parseInt(val)
    }
    return val
}

export function changeTheme(val){
    val = formatForTheme(val)
    if(document.body.classList.length>0){
        document.body.classList.remove(document.body.classList[0])
    }
    document.body.classList.add(`sky-gradient-${val}`)
}