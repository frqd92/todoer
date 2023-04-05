import "/src/calendar/mainCal.css";
import { elementCreator } from "../utilities/elementCreator";
import { createSmartInput } from "./smartInput/smartInput";
import { createInfoBox } from "../utilities/infoBox/infoBox";

export function CreateMainCal(type, outputBtn, smartInputBool){
    const mainCalDiv = elementCreator("div", ["class", "main-cal", `main-cal-${type}`], false, false)
    if(smartInputBool){smartInput(mainCalDiv, outputBtn)};

    return mainCalDiv;
}


function smartInput(parent, output){
    const inputDiv = createSmartInput(output);
    const input = inputDiv.querySelector("input");
    parent.appendChild(inputDiv);
    input.focus()


}