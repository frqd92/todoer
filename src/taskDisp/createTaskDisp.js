import { elementCreator } from '../utilities/elementCreator';
import { mainTaskArr, isLogged, timeframeOption } from '../state';
import '/src/taskDisp/taskDisp.css'
import { readUserTasksServer} from '../firebase';
import { dispDateStrToObjDate, fullFormattedDate} from '../utilities/dateUtils';
import { returnRangeTasks, sortByDate } from '../utilities/sortTasks';
import { createMiniCal } from '../Header/createHeader';
import { prioToColor } from '../utilities/priorityColor';
import { followMouseHoverText } from '../utilities/hoverDiv';
import { findRelativeDate, returnMonth } from '../utilities/dateUtils';
import { processRepeat } from './processRepeat';
import { createSRCal } from '../timeframe/createTimeframe';
import { CalTaskFactory, countMonthTasks } from './calTask';
import { checkForTasks } from '../mainPage/mainPage';
export function createTaskDisplay(){
    if(document.getElementById("task-disp-main")!==null) document.getElementById("task-disp-main").remove()
    const taskDispDiv = elementCreator("div", ["id", "task-disp-main"], false, document.body);

    if(isLogged) readUserTasksServer(true)
    else renderTasks()
}

function TaskFactory(taskObj, dispDiv){
    let rowDiv, upperPart, lowerPart;
    function createTaskElements(){
        rowDiv = elementCreator("div", ["class", "task-row-main"], false, dispDiv);
        upperPart = elementCreator("div", ["class", "task-row-upper"], false, rowDiv );
                // if repeated elem
                if(taskObj.isRepObject){
                    rowDiv.classList.add("task-row-repeated");
                    const repLabel = elementCreator("div", ["class", "tr-repeated-label"], "Recurring", upperPart);
                }
        const dueLine = elementCreator("div", ["class", "div-line"], false, upperPart)
        const titleDiv = elementCreator("div", ["class", "tr-title"], false, upperPart);
        elementCreator("p", false, taskObj.title, titleDiv)
        const dueDiv = elementCreator("div", ["class", "tr-due"], false, upperPart);
        dueDiv.appendChild(createMiniCal(taskObj.due, "task"));
        const dueText = elementCreator("span", false, taskObj.due, dueDiv);
        const otherInfoDiv = elementCreator("div", ["class","tr-other-div"], false, upperPart);
        const trGroup = elementCreator("div", ["class", "tr-group"], taskObj.group?taskObj.group:"No group", otherInfoDiv);
        const trPriority = elementCreator("div", ["class","tr-priority"], false, otherInfoDiv);
        trPriority.style.background = prioToColor(taskObj.priority)
        const trRepeat = createRepeatIcon(taskObj.repeat?true:false);
        otherInfoDiv.appendChild(trRepeat) ;
        const checkBoxDiv = createCheckbox(upperPart);
        followMouseHoverText(trPriority, taskObj.priority + " priority");
        if(taskObj.group){ followMouseHoverText(trGroup, taskObj.group) }
        followMouseHoverText(trRepeat,taskObj.repeat?"Repeat every " + taskObj.repeat:"no repeat");
        lowerPart = elementCreator("div", ["class", "task-row-lower"], false, rowDiv);
        const lowerBox = elementCreator("div", ["class", "tr-l-box"], false, lowerPart)
        const lowerPrioLabel = elementCreator("div", ["class", "tr-l-prio"], taskObj.priority + " priority", lowerBox);
        lowerPrioLabel.style.background = prioToColor(taskObj.priority);
        const editBtn = elementCreator("div", ["class", "tr-l-edit"], "Edit",lowerBox);
        
        const lowerTitleDiv = elementCreator("div", ["class", "tr-l-title-div"], false, lowerPart)
        const title = elementCreator("div", ["class", "tr-l-title"], taskObj.title , lowerTitleDiv)
        const descTxt = taskObj.description?taskObj.description:"No description..."
        const description = elementCreator("div", ["class", "tr-l-desc"], descTxt , lowerTitleDiv)
        
        const lowerInfoDiv =elementCreator("div", ["class", "tr-l-info"], false, lowerPart)
        const dueLowerDiv = elementCreator("div", ["class", "tr-l-elem"], false , lowerInfoDiv)
        elementCreator("p", false, "Due date", dueLowerDiv);
        elementCreator("p", false, fullFormattedDate(taskObj.due), dueLowerDiv);
        // change the repeat ones after
        const dateEnteredDiv = elementCreator("div", ["class", "tr-l-elem"], false, lowerInfoDiv)
        elementCreator("p", false, "Date entered", dateEnteredDiv);
        elementCreator("p", false, fullFormattedDate(taskObj.dateEntered), dateEnteredDiv);

        const groupLowerDiv = elementCreator("div", ["class", "tr-l-elem"], false , lowerInfoDiv)
        elementCreator("p", false, "Group", groupLowerDiv);
        elementCreator("p", false, taskObj.group?taskObj.group:"No group", groupLowerDiv);

        const repeatLowerDiv = elementCreator("div", ["class", "tr-l-elem"], false , lowerInfoDiv)
        elementCreator("p", false, "Repeated task", repeatLowerDiv);
        elementCreator("p", false, taskObj.repeat?taskObj.repeat:"No repeat", repeatLowerDiv);

        if(taskObj.notes){
            const notesDiv = elementCreator("div", ["class", "tr-notes-div"], false, lowerPart);
            const notesBtnDiv = elementCreator("div", ["class", "tr-notes-btn"], false, notesDiv);
            const notesLabel = elementCreator("p", false, "Show notes", notesBtnDiv);
            const notesArrow = elementCreator("span", false, "<", notesBtnDiv);
            const notesDisp = elementCreator("div", ["class", "tr-notes-disp"], taskObj.notes, notesDiv);
            notesBtnDiv.addEventListener("click", showHideNotes)
        
            function showHideNotes(){
                if(!this.className.includes("tr-notes-show")){
                    this.classList.add("tr-notes-show");
                    notesArrow.classList.add("notes-arrow-show");
                    notesLabel.innerText = "Hide notes";
                    notesDisp.classList.add("tr-show-notes")
                }
                else{
                    this.classList.remove("tr-notes-show")
                    notesArrow.classList.remove("notes-arrow-show");
                    notesLabel.innerText = "Show notes";
                    notesDisp.classList.remove("tr-show-notes")

                }
            }
        
        }

        upperPart.addEventListener("click", showHideLower);
        function showHideLower(e){
            if(e.target.closest(".tr-check-outer")) return;
            if(!this.className.includes("upper-opened")) showLowerTask()
            else hideLowerTask()
        }
    }

    function showLowerTask(){
        closeAll()
        upperPart.classList.add("upper-opened");
        lowerPart.classList.add("lower-opened");
    }
    function hideLowerTask(){
        upperPart.classList.remove("upper-opened")
        lowerPart.classList.remove("lower-opened")
    }
    function closeAll(){
        const allRows = document.querySelectorAll(".task-row-main");
        allRows.forEach(row=>{
            const upperPart = row.querySelector(".task-row-upper");
            const lowerPart = row.querySelector(".task-row-lower");
            upperPart.classList.remove("upper-opened")
            lowerPart.classList.remove("lower-opened")
        })
    }

    return {rowDiv, createTaskElements}
}

export function renderTasks(){
    createSRCal()
    const taskDispDiv = document.getElementById("task-disp-main");
    const [fromDate, toDate] = getFromToDate();
    const tasksToDisplay = returnRangeTasks(mainTaskArr, fromDate, toDate);
    //check for repeated tasks
    const chosenDate = taskboxDateArray(document.querySelector(`.${timeframeOption.toLocaleLowerCase()}-date-range`), timeframeOption);
    mainTaskArr.forEach(elem=>{
        if(elem.repeat){
            const repeatedElem = processRepeat(elem, chosenDate);
            if(repeatedElem){
                repeatedElem.forEach(repElem=>{tasksToDisplay.push(repElem)})
            }
        }

    })
    if(tasksToDisplay.length===0){
        checkForTasks()
        return;
    }
    taskDispDiv.classList.remove("empty-task-div");
    //sort by date
    const sortedTasks = sortByDate(tasksToDisplay, true);

    sortedTasks.forEach((task, i)=>{
        if((i>=1 && task.due!==sortedTasks[i-1].due) || i===0){
            const taskDueGroup = TaskGroupFactory(taskDispDiv, task);
            taskDueGroup.createTaskGroup();
        }
        const allGroups = document.querySelectorAll(".td-grouped-tasks-div");
        const row = TaskFactory(task, allGroups[allGroups.length-1]);
        row.createTaskElements()
        if(timeframeOption==="Week" || timeframeOption==="Month"){
            const calRow = CalTaskFactory(row, task);
            calRow.createCalRow();
        }
    })
    if(timeframeOption==="Month"){
        countMonthTasks();
    }


}

function TaskGroupFactory(dispDiv, task){
    let taskDueGroup, tasksContainer, numOfTasks, arrow;
    function createTaskGroup(){
        taskDueGroup = elementCreator("div", ["class", "td-grouped"], false, dispDiv);
        const dropDiv = elementCreator("div", ["class", "td-grouped-drop"], false, taskDueGroup);
        const dropText = elementCreator("p", false, fullFormattedDate(task.due, true), dropDiv);
        arrow = elementCreator("span", false, "<", dropDiv);
        tasksContainer = elementCreator("div", ["class","td-grouped-tasks-div"], false, taskDueGroup);
        numOfTasks = elementCreator("p", ["class", "td-group-num-tasks"], false, taskDueGroup);
        numOfTasks.style.display = "none";
        dropDiv.addEventListener("click", closeOpenTaskGroup)
    }
    function closeOpenTaskGroup(){
        if(this.className.includes("td-group-hide")){
            this.classList.remove("td-group-hide")
            tasksContainer.classList.remove("td-group-container-hide");
            numOfTasks.style.display = "none";
            arrow.classList.remove("group-arrow-hide")
            
        }
        else{
            this.classList.add("td-group-hide")
            tasksContainer.classList.add("td-group-container-hide")
            const length = tasksContainer.children.length;
            const txt = length>1?" hidden tasks":" hidden task";
            numOfTasks.innerText = length + txt;
            numOfTasks.style.display = "block";
            arrow.classList.add("group-arrow-hide")
        }
    }

    return {taskDueGroup, tasksContainer, createTaskGroup, closeOpenTaskGroup}
}



//takes the selected range of time, and displays all the dates in an array
function taskboxDateArray(dateDiv, type){
    if(type==="Day"){
        const [dd,mm,yy] = textDateToNum(dateDiv.innerText).split("/");
        return [[Number(dd), Number(mm), Number(yy)]];
    }
    else if(type==="Week"){
        const allArr = [];
        const dateStart = dateDiv.querySelector(".week-date-range p").innerText;
        for(let i=0;i<7;i++){
            const [dd,mm,yy] = findRelativeDate(dateStart, i, true).split("/");
            allArr.push([Number(dd), Number(mm), Number(yy)])
        }
        return allArr;
    }
    else if(type==="Month"){
        const allArr = [];
        const monthSquares = document.querySelectorAll(".sr-m-square");
        let [mm,yy] = dateDiv.innerText.split(" ");
        mm = returnMonth(mm);
        for(let i=1;i<=monthSquares.length;i++){
            allArr.push([i,mm,Number(yy)]);
        }
        return allArr;
    }
}




function createRepeatIcon(bool){
    const mainDiv = elementCreator("div", ["class", "repeat-icon-div"], false, false)
    if(!bool){
        elementCreator("div", ["class", "repeat-icon-dash"], false, mainDiv)
        elementCreator("div", ["class", "repeat-icon-dash"], false, mainDiv)
    }
    for(let i=0;i<2;i++){
        const div = elementCreator("div", ["class", "repeat-icon"], false, mainDiv);
        if(i===1) div.classList.add("repeat-icon-bottom");
        const line = elementCreator("div", false, false, div);
        const arrow = elementCreator("div", false, ">", div);
    }
    return mainDiv
}


export function createEmptyMessage(parent){
    if(document.getElementById("empty-task-div")){
        document.getElementById("empty-task-div").remove()
    }

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
                dispDateStrToObjDate(allS[0].id.split("-").pop()),
                dispDateStrToObjDate(allS[allS.length-1].id.split("-").pop())
            ];
    }

}



