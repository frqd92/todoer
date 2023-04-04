import '/src/utilities/infoBox/infoBox.css'
import { elementCreator } from '../elementCreator';

export function createInfoBox(hoverText){
    const mainDiv = elementCreator("div", ["class", "info-box-div"], false, false);
    const iDiv = elementCreator("div", ["class", "info-box"], false, mainDiv);
    elementCreator("span", false, "i", iDiv)
    const infoBox = elementCreator("div", ["class", "info-hover-text"], hoverText, mainDiv);

    mainDiv.addEventListener("mouseover", showContent);
    mainDiv.addEventListener("mouseleave", hideContent);
    function showContent(){
        infoBox.classList.add("info-hover-shown")
    }
    function hideContent(){
        infoBox.classList.remove("info-hover-shown")
    }


    return mainDiv
}