import { elementCreator } from "../utilities/elementCreator";
import { timeframeOption } from "../state";

export function CalTaskFactory(dispRow, taskObj){
    const calSquare = document.getElementById(`datecal-${taskObj.due}`);
    const calTaskContainer = calSquare.querySelector(".sr-task-div");
    let calTaskDiv;
    function createCalRow(){
        calTaskDiv = elementCreator("div", ["class","cal-task",`cal-task-${timeframeOption.toLocaleLowerCase()}`], false, calTaskContainer);
        const title = elementCreator("p", ["class", "cal-task-title"], taskObj.title, calTaskDiv);
    }

    return {calTaskDiv, createCalRow}
}

export function countMonthTasks(){
    const allSquares = document.querySelectorAll(".sr-m-square");
    allSquares.forEach(square=>{
        const numOfTasksTxt= square.querySelector(".sr-month-task-cont")
        const numOfTasks = square.querySelector(".sr-task-div").children.length;
        if(numOfTasks>0){
            numOfTasksTxt.innerText = numOfTasks + " tasks"
        }

    })
}