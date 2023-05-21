export function elementCreator(type, selector,text, parent, isPrepend, placeholder){
    const element = document.createElement(type);
    if(selector){
        if(selector[0]==="class"){
            for(let i=1;i<selector.length;i++)
            element.classList.add(selector[i])
        }
        else if(selector[0]==="id"){
            element.id=selector[1];
        }
    }
    if(text){
        if(type==="input" || type==="textarea"){
            if(placeholder){
                element.placeholder = text;
            }
            else{
                element.value = text;
            }
        }
        else{
            element.innerText = text;

        }
    }
    if(parent){
        !isPrepend?parent.appendChild(element):parent.prepend(element);
    }

    return element;
}
