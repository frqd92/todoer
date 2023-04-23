import { elementCreator } from "../utilities/elementCreator";
import { timeframeOption } from "../state";


export function CalTaskFactory(dispRow, taskObj, showLowerTask){
    const calSquare = document.getElementById(`datecal-${taskObj.due}`);
    const calTaskContainer = calSquare.querySelector(".sr-task-div");
    const rowGroup = dispRow.parentElement.parentElement;
    const completeBtn = dispRow.querySelector(".tr-check-outer");
    completeBtn.addEventListener("click", updateCalComplete)
    let calTaskDiv, completeLine;
    function createCalRow(){
        calTaskDiv = elementCreator("div", ["class","cal-task",`cal-task-${timeframeOption.toLocaleLowerCase()}`], false, calTaskContainer);
        const title = elementCreator("p", ["class", "cal-task-title"], taskObj.title, calTaskDiv);
        completeLine = elementCreator("div", ["class", "cal-task-line"], false, title);
        if(completeBtn.className.includes("tr-outer-true")) completeLine.classList.add("cal-line-complete");
        calTaskDiv.addEventListener("mouseover", highlightTasks)    
        calTaskDiv.addEventListener("mouseleave", dehighlightTasks)
        calTaskDiv.addEventListener("click", scrollTask)   
        dispRow.addEventListener("mouseover", highlightTasks) 
        dispRow.addEventListener("mouseleave", dehighlightTasks)   
    }

    function scrollTask(){
        showLowerTask();
        dispRow.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
    function highlightTasks(){
        if(rowGroup.className.includes("td-grouped-hide")){
            rowGroup.classList.add("highlighted-task");
        }
        calTaskDiv.classList.add("highlighted-task")
        dispRow.classList.add("highlighted-task")
        

    }

    function dehighlightTasks(){
        calTaskDiv.classList.remove("highlighted-task")
        dispRow.classList.remove("highlighted-task")
        if(rowGroup.className.includes("td-grouped-hide")){
            rowGroup.classList.remove("highlighted-task");
        }
    }

    function updateCalComplete(){
        if(this.className.includes("tr-outer-true")){
            completeLine.classList.add("cal-line-complete")
        }
        else{
            completeLine.classList.remove("cal-line-complete")

        }
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