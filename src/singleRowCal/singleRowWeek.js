import { elementCreator } from '../utilities/elementCreator';
import { addZero, addZeroDispDate, dispDateStrToObjDate, findRelativeDate, getToday, isPast, returnMonth } from '../utilities/dateUtils';
import '/src/singleRowCal/singleRow.css'
import { createAddModal } from '../taskModal/createModal';
import { makeAdd } from '../Header/createHeader';

export function createWeekCal(){
    const calContainer = document.querySelector(".tf-cal-container");
    const calDiv = elementCreator("div", ["class", "sr-week-div"], false, calContainer);
    createWeekSquares(calDiv);

    
}

function createWeekSquares(parent){
    const dateStart = document.querySelector(".week-date-range p").innerText;
    const [todayDD, todayMM, todayYY] = getToday().split("/");

    const weekNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    for(let i=0;i<7;i++){
        const square = elementCreator("div", ["class", "sr-w-square"], false, parent);
        const weekLabel = elementCreator("div", ["class", "sr-week-label-week"], weekNames[i], square);
        let [squareDay, squareMonth, squareYear] = findRelativeDate(dateStart, i, true).split("/");
        const month = returnMonth(squareMonth).slice(0,3);
        const clDate = addZeroDispDate(`${squareDay}/${Number(squareMonth)+1}/${squareYear}`)
        square.id = `datecal-${clDate}`

        if(squareDay==todayDD && squareMonth===todayMM && squareYear===todayYY){
            elementCreator("p", ["class", "sr-week-day-num"], "Today", square)
            square.classList.add("sr-week-today");
        }
        else if(squareDay==1 && squareMonth==0){
            elementCreator("p", ["class", "sr-week-day-num"],`${month} ${squareYear}`,square)
        }
        else if(i===0 || (i!==0 && squareDay==1)){
            elementCreator("p", ["class", "sr-week-day-num"],`${month} ${squareDay}`, square)
        }
        else{
            elementCreator("p", ["class", "sr-week-day-num"],squareDay,square)
        }
        //where tasks are stored
        const calTasksDiv = elementCreator("div", ["class", "sr-task-div"], false, square);
        if(!isPast(dispDateStrToObjDate(clDate))){
            const calAddTask = elementCreator("div", ["class", "sr-cal-add-task"], "+", square);
            calAddTask.addEventListener("click", makeAdd)
        }

    }
}

