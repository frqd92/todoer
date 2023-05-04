import { elementCreator } from '../utilities/elementCreator';
import { mainTaskArr, isLogged, timeframeOption, addNewTaskLocal } from '../state';
import '/src/taskDisp/taskDisp.css'
import { readUserTasksServer} from '../firebase';
import { dateObjToFullFormatted, dispDateStrToObjDate, fullFormattedDate, textDateToNum} from '../utilities/dateUtils';
import { getFirstTaskDay, makeDeepCopy, returnRangeTasks, sortByDate } from '../utilities/sortTasks';
import { createMiniCal, makeAdd } from '../Header/createHeader';
import { prioToColor } from '../utilities/priorityColor';
import { followMouseHoverText } from '../utilities/hoverDiv';
import { findRelativeDate, returnMonth } from '../utilities/dateUtils';
import { processRepeat } from './processRepeat';
import { createSRCal } from '../timeframe/createTimeframe';
import { CalTaskFactory, countMonthTasks } from './calTask';
import { writeUserTasksServer } from '../firebase';
import { deleteTaskFunc } from './deleteTask';
import { settingsObj } from '../filterOptions/filterOptions';


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

        //details attached to row in order to filter after
        rowDiv.objFilter = {
            complete : false,
            repeat : taskObj.repeat,
            priority: taskObj.priority,
            group: taskObj.group
        }

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
        const checkBoxDiv = createCheckbox(upperPart, taskObj);
        followMouseHoverText(trPriority, taskObj.priority + " priority");
        if(taskObj.group){ followMouseHoverText(trGroup, taskObj.group) }
        followMouseHoverText(trRepeat,taskObj.repeat?"Repeat every " + taskObj.repeat:"no repeat");
        lowerPart = elementCreator("div", ["class", "task-row-lower"], false, rowDiv);
        const lowerBox = elementCreator("div", ["class", "tr-l-box"], false, lowerPart)
        const lowerPrioLabel = elementCreator("div", ["class", "tr-l-prio"], taskObj.priority + " priority", lowerBox);
        lowerPrioLabel.style.background = prioToColor(taskObj.priority);
        const editDltDiv = elementCreator("div", ["class", "tr-btn-div"], false, lowerBox)
        const editBtn = elementCreator("div", ["class", "tr-l-edit"], "Edit",editDltDiv);
        const deleteBtn = elementCreator("div", ["class", "tr-l-delete"], "Delete",editDltDiv);

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
        editBtn.addEventListener("click",()=>{makeAdd(taskObj)});
        deleteBtn.btnObj = taskObj; 
        deleteBtn.addEventListener("click", deleteTaskFunc)
        function showHideLower(e){
            if(e.target.closest(".tr-check-outer")) return;
            if(!this.className.includes("upper-opened")) showLowerTask()
            else hideLowerTask()
        }
        return rowDiv
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

    return {createTaskElements, showLowerTask}
}

function getFromToDateAll(){
    const allSelection = document.querySelector(".all-date-range").innerText;
    let sorted;

    if(allSelection==="All tasks"){
        sorted = sortByDate(mainTaskArr, true);
    }
    else{
        const from = new Date(`${allSelection}/01/01`);
        const to = new Date(`${allSelection}/12/31`);

        const yearArr = returnRangeTasks(mainTaskArr,from, to);
        sorted = sortByDate(yearArr, true);
    }
    if(sorted.length<1) return [false]
    return [
        dispDateStrToObjDate(sorted[0].due),
        dispDateStrToObjDate(sorted[sorted.length-1].due)
    ]

}
export function renderTasks(){
    if(timeframeOption!=="All")createSRCal()
    const taskDispDiv = document.getElementById("task-disp-main");
    let fromDate, toDate;
    if(timeframeOption!=="All"){[fromDate, toDate] = getFromToDate()}
    else{
        [fromDate, toDate] = getFromToDateAll()
    }
    const tasksToDisplay = returnRangeTasks(mainTaskArr, fromDate, toDate);
    //check for repeated tasks
    const chosenDate = taskboxDateArray(document.querySelector(`.${timeframeOption.toLocaleLowerCase()}-date-range`), timeframeOption);
    mainTaskArr.forEach(elem=>{
        if(elem.repeat){
            const repeatedElem = processRepeat(elem, chosenDate);
            if(repeatedElem){
                repeatedElem.forEach(repElem=>{
                    //check for exception
                    let isExc = false;
                    if(Object.keys(elem.repeatException).length>1){
                        elem.repeatException.none = false;
                        for(let [key, exception] of Object.entries(elem.repeatException)){
                            if(exception!=="none"){
                                if(exception===repElem.due){
                                    isExc = true;
                                    return;
                                }
                            }
                        }
                    }
                    if(!isExc) tasksToDisplay.push(repElem)
                })
            }
        }

    })

    taskDispDiv.classList.remove("empty-task-div");
    //sort by date
    const boolSort = settingsObj.sort?false:true;

    //final arr, filtered and sorted
    const finalTasks = checkForFilter(sortByDate(tasksToDisplay, boolSort));

    if(finalTasks.length===0){
        createEmptyMessage(taskDispDiv)
        return;
    }

    //renders the tasks from the arr to the display
    renderTasksToDisp(finalTasks, false)

    if(timeframeOption==="Month"){
        countMonthTasks();
    }
}

function renderTasksToDisp(sortedTasks, loadMore){
    const taskDispDiv = document.getElementById("task-disp-main");
    let arrDiv, initialVal;
    if(!loadMore){
        arrDiv = divideTasks();
        initialVal=0;
    }
    else{
        if(loadMore.count===sortedTasks.length){
            loadMore.remove()
            return;
        }
        arrDiv=sortedTasks;
        initialVal=loadMore.count;

    }
    if(timeframeOption==="All"){
        for(let x=initialVal;x<initialVal+1;x++){
            for(let i=0;i<arrDiv[x].length;i++){
                if((i>=1 && arrDiv[x][i].due!==arrDiv[x][i-1].due) || i===0){
                    const taskDueGroup = TaskGroupFactory();
                    taskDueGroup.createTaskGroup(taskDispDiv, arrDiv[x][i]);
                }
                const allGroups = document.querySelectorAll(".td-grouped-tasks-div");
                const rowCreate = TaskFactory(arrDiv[x][i], allGroups[allGroups.length-1]);
                const row = rowCreate.createTaskElements();
        
                if(timeframeOption!=="All"){
                    const createRow = CalTaskFactory(row, arrDiv[x][i], rowCreate.showLowerTask);
                    createRow.createCalRow();
                }
            }
        }
        if(arrDiv.length>1 && document.querySelector(".load-more-tasks")===null){
            const loadMoreBtn = createLoadMoreBtn(arrDiv)
            taskDispDiv.appendChild(loadMoreBtn)
        }
        if(loadMore){
            taskDispDiv.appendChild(loadMore)
        }
    }
    else{
        for(let i=0;i<sortedTasks.length;i++){
            if((i>=1 && sortedTasks[i].due!==sortedTasks[i-1].due) || i===0){
                const taskDueGroup = TaskGroupFactory(); 
                taskDueGroup.createTaskGroup(taskDispDiv, sortedTasks[i]);
            }
            const allGroups = document.querySelectorAll(".td-grouped-tasks-div");
            const rowCreate = TaskFactory(sortedTasks[i], allGroups[allGroups.length-1]);
            const row = rowCreate.createTaskElements();

            const createCalRow = CalTaskFactory(row, sortedTasks[i], rowCreate.showLowerTask);
            createCalRow.createCalRow();
        }

    }


    function divideTasks(){
        const numDiv = Math.ceil(sortedTasks.length/20)
        const dividedArr =  Array.from({length: numDiv},()=>[]);
    
        const copySorted = makeDeepCopy(sortedTasks);
        let indexArrDiv = 0;
        let count = 0;
        for(let i=0;i<copySorted.length;i++){
            dividedArr[indexArrDiv].push(copySorted[i]);
            count++;
            if(count%20===0){indexArrDiv++}
        } 
        return dividedArr;
    }

}

function createLoadMoreBtn(arrDiv){
    const destroyAt = arrDiv.length;
    const loadMoreDiv = elementCreator("div", ["class", "load-more-tasks"], false, false);


    loadMoreDiv.count=0;
    elementCreator("p", false, "More tasks available", loadMoreDiv);
    elementCreator("span", false, "↓", loadMoreDiv);
    loadMoreDiv.addEventListener("click", increaseLoad);
    function increaseLoad(){
        this.count++;
        renderTasksToDisp(arrDiv, this)
        if(this.count===destroyAt){
            loadMoreDiv.remove()
        }
    }
    return loadMoreDiv;
}




function checkForFilter(tasks){
    let filteredArr = [];
    const setObj = settingsObj.filter;
    let isValid = true;
  
    tasks.forEach(task=>{
        if(!setObj.completed){
            if(task.isComplete){
                isValid = false;
                return;
            }
            else{isValid= true}
        }
        if(!setObj.incomplete){
            if(!task.isComplete){
                isValid = false;
                return;
            }
            else{isValid= true}
        }

        if(!setObj[task.priority]){
            isValid=false;
            return;
        }
        else{
            isValid=true;
        }
        if(!setObj.repeated){
            if(task.repeat){
                isValid=false;
                return;
            }
            else{
                isValid=true;
            }
        }

        if(isValid){
            filteredArr.push(task)
        }
        isValid=true;
    })

    return filteredArr;

}




export function TaskGroupFactory(){

    let taskDueGroup, dropDiv, tasksContainer, numOfTasks, arrow;
  
    function createTaskGroup(dispDiv, task){
        taskDueGroup = elementCreator("div", ["class", "td-grouped"], false, dispDiv);
        taskDueGroup.closeFunc = closeTaskGroup;
        taskDueGroup.openFunc = openTaskGroup;
        dropDiv = elementCreator("div", ["class", "td-grouped-drop"], false, taskDueGroup);
        const dropText = elementCreator("p", false, dateObjToFullFormatted(dispDateStrToObjDate(task.due)), dropDiv);
        arrow = elementCreator("span", false, "<", dropDiv); 
        tasksContainer = elementCreator("div", ["class","td-grouped-tasks-div"], false, taskDueGroup);
        numOfTasks = elementCreator("p", ["class", "td-group-num-tasks"], false, taskDueGroup);
        numOfTasks.style.display = "none";
        dropDiv.addEventListener("click", taskGroupClick)
    }

    function taskGroupClick(){
        if(dropDiv.className.includes("td-group-hide")){
            openTaskGroup()
        }
        else{
            closeTaskGroup()
        }
    }
    function closeTaskGroup(){
        dropDiv.classList.add("td-group-hide")
        tasksContainer.classList.add("td-group-container-hide")
        const length = tasksContainer.children.length;
        const txt = length>1?" hidden tasks":" hidden task";
        numOfTasks.innerText = length + txt;
        numOfTasks.style.display = "block";
        arrow.classList.add("group-arrow-hide")
        taskDueGroup.classList.add("td-grouped-hide")

    }
    function openTaskGroup(){
        dropDiv.classList.remove("td-group-hide")
        tasksContainer.classList.remove("td-group-container-hide");
        numOfTasks.style.display = "none";
        arrow.classList.remove("group-arrow-hide")
        taskDueGroup.classList.remove("td-grouped-hide")

    }
    return Object.assign({createTaskGroup})
    return { createTaskGroup, openTaskGroup, closeTaskGroup}
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
    else if(type==="All"){
        if(mainTaskArr.length<1) return
        const allArr = [];
        const allRange = document.querySelector(".all-date-range").innerText;
        if(allRange!=="All tasks"){
            let firstDayYear = new Date(`${allRange}/1/1`);
            const lastDayYear = new Date(`${allRange}/12/31`);
            while(firstDayYear.getTime()<=lastDayYear.getTime()){
                allArr.push([firstDayYear.getDate(), firstDayYear.getMonth(), firstDayYear.getFullYear()])
                firstDayYear.setDate(firstDayYear.getDate()+1);
            }
        }
        else{
            let firstDayTask = getFirstTaskDay();
            let lastDayTask = new Date();
            console.log();
            lastDayTask.setFullYear(firstDayTask.getFullYear()+10)
            while(firstDayTask.getTime()<=lastDayTask.getTime()){
                allArr.push([firstDayTask.getDate(), firstDayTask.getMonth(), firstDayTask.getFullYear()])
                firstDayTask.setDate(firstDayTask.getDate()+1);
            }
        }
        return allArr
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


function createCheckbox(rowParent, taskObj){
    const taskRowMain = rowParent.parentElement;
    const outerDiv = elementCreator("div", ["class", "tr-check-outer"], false, rowParent);
    const check = elementCreator("p", false, "✓", outerDiv);
    const checkLine = rowParent.querySelector(".div-line");
    if(taskObj.isComplete) checkFunc()

    outerDiv.addEventListener("click", checkFunc);
    function checkFunc(){
        if(!outerDiv.className.includes("tr-outer-true")){
            outerDiv.classList.add("tr-outer-true");
            check.classList.add("tr-check-true");
            setTimeout(()=>{checkLine.classList.add("div-line-checked")}, 200)
            taskObj.isComplete = true;
            taskRowMain.objFilter.complete = true;
        }
        else{
            outerDiv.classList.remove("tr-outer-true");
            check.classList.remove("tr-check-true");
            checkLine.classList.remove("div-line-checked")
            taskObj.isComplete = false;
            taskRowMain.objFilter.complete = false;
        }
        alterCompleteStatus(taskObj)
    }
}

function alterCompleteStatus(obj){
    const taskID = obj.uniqueID;
    mainTaskArr.forEach(task=>{
        if(task.uniqueID===taskID){
            task.isComplete = obj.isComplete;
            return;
        }
    })
    if(isLogged){
      writeUserTasksServer(mainTaskArr)
    }
    else{
        addNewTaskLocal()
    }
}


function getFromToDate(){
    switch(timeframeOption){
        case "Week":
            const [from, to] = document.querySelectorAll(".week-date-range p");
            return [dispDateStrToObjDate(from.innerText),dispDateStrToObjDate(to.innerText)];
        case "Month":
            const allS = document.querySelectorAll('.sr-m-square');
            return [
                dispDateStrToObjDate(allS[0].id.split("-").pop()),
                dispDateStrToObjDate(allS[allS.length-1].id.split("-").pop())
            ];
        case "Day":
            const dayDate = document.querySelector(".day-date-range").innerText;
            const date = dispDateStrToObjDate(textDateToNum(dayDate, true));
            return [date, date];          
    }

}




