import { elementCreator } from "./elementCreator";
export function followMouseHoverText(div, txt){
    div.addEventListener("mouseover", makeVisible, {once:true});
    let hoverDiv;
    function makeVisible(){
        let hoverStyle = document.createElement('style');
        document.head.appendChild(hoverStyle);
        hoverDiv = elementCreator("div", ["class", "create-hover-text"], txt, document.body);
        hoverStyle.innerHTML = `
        .create-hover-text{
            whitespace: nowrap;
            font-family: ptserif;
            position: fixed;
            background: white;
            border: 1px solid black;
            padding: 2px 5px;
            z-index: 100;
        }
        `
        div.addEventListener("mouseleave", makeInvisible, {once:true});
        div.addEventListener("mousemove", followMouse);
    }
    function makeInvisible(){
        document.querySelector(".create-hover-text").remove();
        div.addEventListener("mouseover", makeVisible, {once:true});
        div.removeEventListener("mousemove", followMouse);
    }
    const rect = div.getBoundingClientRect();

    function followMouse(e){
        console.log("shart");
        console.log(window.scrollY);
        hoverDiv.style.top= (e.pageY - 22 - window.scrollY)+"px";
        hoverDiv.style.left= (e.pageX + 12)+"px";
    }
}