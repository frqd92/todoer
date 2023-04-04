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
        if(type==="input"){
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

export function imageCreator(source, selector, parent){
    const img = document.createElement("img");
    img.src = source;
    if(selector){
        if(selector[0]==="class"){
            for(let i=1;i<selector.length;i++)
            img.classList.add(selector[i])
        }
        else if(selector[0]==="id"){
            img.id=selector[1];
        }
    }
    if(parent){
        parent.appendChild(img)
    }
    return img;
}