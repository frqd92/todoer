import { elementCreator } from "../utilities/elementCreator";
import { timeframeOption } from "../state";

export function CalTaskFactory(dispRow, taskObj){
    const calSquare = document.getElementById(`datecal-${taskObj.due}`);
    const calTaskContainer = calSquare.querySelector(".sr-task-div");
    let calTaskDiv;
    function createCalRow(){
     
        calTaskDiv = elementCreator("div", ["class","cal-task",`cal-task-${timeframeOption.toLocaleLowerCase()}`], false, calTaskContainer);
        const title = elementCreator("p", ["class", "cal-task-title"], taskObj.title, calTaskDiv);
        calTaskDiv.addEventListener("mouseover", highlightTasks)    
        calTaskDiv.addEventListener("mouseleave", dehighlightTasks)
        calTaskDiv.addEventListener("click", scrollTask)   
        dispRow.addEventListener("mouseover", highlightTasks) 
        dispRow.addEventListener("mouseleave", dehighlightTasks)   
    }

    function scrollTask(){
        dispRow.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
    function highlightTasks(){
        calTaskDiv.classList.add("highlighted-task")
        dispRow.classList.add("highlighted-task")
    

    }

    function dehighlightTasks(){
        calTaskDiv.classList.remove("highlighted-task")
        dispRow.classList.remove("highlighted-task")

    }
    return {calTaskDiv, createCalRow}
}





export function countMonthTasks(){
    const allSquares = document.querySelectorAll(".sr-m-square");
    allSquares.forEach(square=>{
        const numOfTasksTxt= square.querySelector(".sr-month-task-cont")
        const numOfTasks = square.querySelector(".sr-task-div").children.length;
        if(numOfTasks>0){
            const taskTxt = numOfTasks===1?"task":"tasks";
            numOfTasksTxt.innerText = numOfTasks +" "+ taskTxt;
        }

    })
}