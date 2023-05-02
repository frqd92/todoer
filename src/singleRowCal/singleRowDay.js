import { makeAdd } from "../Header/createHeader";
import { addZeroDispDate, dispDateStrToObjDate, isPast, textDateToNum } from "../utilities/dateUtils";
import { elementCreator } from "../utilities/elementCreator";

export function createDayCal(){
    const calContainer = document.querySelector(".tf-cal-container");
    const dayDiv = elementCreator("div", ["class", "sr-day-div"], false, calContainer);
    const taskCont = elementCreator("div", ["class", "sr-task-div"], false, dayDiv);
    const dayDate = document.querySelector(".day-date-range").innerText;

    const date = addZeroDispDate(textDateToNum(dayDate, true));
    dayDiv.id = `datecal-${date}`


    if(!isPast(dispDateStrToObjDate(date))){
        const addTaskBtn = elementCreator("div", ["class", "sr-cal-add-task"], "+", dayDiv)
        addTaskBtn.addEventListener("click", makeAdd);
    }


    
}

