import { elementCreator } from '../utilities/elementCreator';
import { mainTaskArr, isLogged, timeframeOption } from '../state';
import '/src/taskDisp/taskDisp.css'
import { readUserTasksServer} from '../firebase';
import { dispDateStrToObjDate} from '../utilities/dateUtils';
import { returnRangeTasks } from '../utilities/sortTasks';
import { createMiniCal } from '../Header/createHeader';
import { prioToColor } from '../utilities/priorityColor';
import { followMouseHoverText } from '../utilities/hoverDiv';
export function createTaskDisplay(){
    if(document.getElementById("task-disp-main")!==null) document.getElementById("task-disp-main").remove()
    const taskDispDiv = elementCreator("div", ["id", "task-disp-main"], false, document.body);

    if(isLogged) readUserTasksServer(true)
    else renderTasks()

}


export function renderTasks(){


    const taskDispDiv = document.getElementById("task-disp-main");
    const [fromDate, toDate] = getFromToDate();
    const tasksToDisplay = returnRangeTasks(mainTaskArr, fromDate, toDate);

    if(tasksToDisplay.length===0){
        createEmptyMessage(taskDispDiv);
        return
    }
    taskDispDiv.classList.remove("empty-task-div");
    tasksToDisplay.forEach(task=>{
        const row = TaskFactory(task, taskDispDiv);
        row.createTaskElements()
    })

}


function TaskFactory(taskObj, dispDiv){

    function createTaskElements(){
        const rowDiv = elementCreator("div", ["class", "task-row-main"], false, dispDiv);
        const upperPart = elementCreator("div", ["class", "task-row-upper"], false, rowDiv );
        const dueLine = elementCreator("div", ["class", "div-line"], false, upperPart)
        const titleDiv = elementCreator("div", ["class", "tr-title"], taskObj.title, upperPart);
        
        const dueDiv = elementCreator("div", ["class", "tr-due"], false, upperPart);
        dueDiv.appendChild(createMiniCal(taskObj.due, "task"));
        const dueText = elementCreator("span", false, taskObj.due, dueDiv);

        const otherInfoDiv = elementCreator("div", ["class","tr-other-div"], false, upperPart);
        const trPriority = elementCreator("div", ["class","tr-priority"], false, otherInfoDiv);
        trPriority.style.background = prioToColor(taskObj.priority)
        const trGroup = elementCreator("div", ["class", "tr-group"], taskObj.group?taskObj.group:"No group", otherInfoDiv);
        const trRepeat = createRepeatIcon();
        otherInfoDiv.appendChild(trRepeat) ;
        
        const checkBoxDiv = createCheckbox(upperPart);

        followMouseHoverText(trPriority, taskObj.priority + " priority");
        if(taskObj.group){
            followMouseHoverText(trGroup, taskObj.group);
        }
        followMouseHoverText(trRepeat, taskObj.repeat?taskObj.repeat:"no repeat");

    }


    return {createTaskElements}
}










function createRepeatIcon(){
    const mainDiv = elementCreator("div", ["class", "repeat-icon-div"], false, false)
    elementCreator("div", ["class", "repeat-icon-dash"], false, mainDiv)
    elementCreator("div", ["class", "repeat-icon-dash"], false, mainDiv)
    for(let i=0;i<2;i++){
        const div = elementCreator("div", ["class", "repeat-icon"], false, mainDiv);
        if(i===1) div.classList.add("repeat-icon-bottom");
        const line = elementCreator("div", false, false, div);
        const arrow = elementCreator("div", false, ">", div);
    }
    return mainDiv
}


function createEmptyMessage(parent){
    const msg = timeframeOption!=="All"?"No tasks in selected time range...":"No tasks to display...";
    parent.classList.add("empty-task-div");
    elementCreator("div", ["id", "task-empty-msg"], msg, parent);
}


function createCheckbox(rowParent){
    const outerDiv = elementCreator("div", ["class", "tr-check-outer"], false, rowParent);
    const check = elementCreator("p", false, "✓", outerDiv);
    const checkLine = rowParent.querySelector(".div-line");

    outerDiv.addEventListener("click", checkFunc);
    function checkFunc(){
        if(!this.className.includes("tr-outer-true")){
            this.classList.add("tr-outer-true");
            check.classList.add("tr-check-true");
            setTimeout(()=>{checkLine.classList.add("div-line-checked")}, 200)
        }
        else{
            this.classList.remove("tr-outer-true");
            check.classList.remove("tr-check-true");
            checkLine.classList.remove("div-line-checked")

        }
    }
}




function getFromToDate(){
    switch(timeframeOption){
        case "Week":
            const [from, to] = document.querySelectorAll(".week-date-range p");
            return [dispDateStrToObjDate(from.innerText),dispDateStrToObjDate(to.innerText)];
        case "Month":
            const allS = document.querySelectorAll(".sr-m-square");
            return [
                dispDateStrToObjDate(allS[0].classList[1].split("-").pop()),
                dispDateStrToObjDate(allS[allS.length-1].classList[1].split("-").pop())
            ];
    }

}



