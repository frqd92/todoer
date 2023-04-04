import '/src/utilities/infoBox/infoBox.css'
import { elementCreator } from '../elementCreator';

export function createInfoBox(hoverText){
    const mainDiv = elementCreator("div", ["class", "info-box-div"], false, false);
    const iDiv = elementCreator("div", ["class", "info-box"], false, mainDiv);
    elementCreator("span", false, "i", iDiv)
    const infoBox = elementCreator("div", ["class", "info-hover-text"], hoverText, mainDiv);

    return iDiv
}