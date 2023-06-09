import { CreateMainCal } from '../../calendar/mainCal';
import { mainTaskArr, timeframeChange } from '../../state';
import { deleteTaskFunc } from '../../taskDisp/deleteTask';
import { processRepeat } from '../../taskDisp/processRepeat';
import { dateObjToFullFormatted, dateObjToStrDate, dispDateStrToObjDate, formatNumDate, recursiveFunc, returnMonth } from '../../utilities/dateUtils';
import { elementCreator } from '../../utilities/elementCreator';
import { followMouseHoverText } from '../../utilities/hoverDiv';
import { sortByDate } from '../../utilities/sortTasks';
import { makeAdd } from '../createHeader';
import '/src/Header/headerCal/headerCal.css'

export function headerCalFunc(calBtn){
    calBtn.addEventListener("click", generateHeadCal);

}

function generateHeadCal(e){
    if(document.querySelector(".header-cal-main")!==null) return;
    const mainCalDiv = elementCreator("div", ["class", "header-cal-main"], false, document.body);
    const titleBar = createTitleBar(mainCalDiv);
    const calDiv = elementCreator("div", ["class", "header-cal-div"], false, mainCalDiv);
    generateNewCal()
}

export function generateNewCal(){
    if(document.querySelector(".main-cal-headerCal")!==null){
        document.querySelector(".main-cal-headerCal").remove()
    }
    const calDiv = document.querySelector(".header-cal-div")
    const cal = CreateMainCal("headerCal", calDiv, false, false);
    calDiv.appendChild(cal)
    headerCalSquareFillInfo(cal)
    const arrowBtns = cal.querySelectorAll(".cal-arrow");
    arrowBtns.forEach(btn=>{
        btn.addEventListener("click", ()=>{
            headerCalSquareFillInfo(cal)
        })
    })
    cal.querySelector(".cal-og-date-btn").addEventListener("click", ()=>{
        headerCalSquareFillInfo(cal)
    })
    window.addEventListener("resize", repositionDiv);
}

function repositionDiv(){
    const calDiv = document.querySelector(".header-cal-main");
    if(calDiv===null) return
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const divLeft = calDiv.offsetLeft;
    const divTop = calDiv.offsetTop;
    const divWidth = calDiv.offsetWidth;
    const divHeight = calDiv.offsetHeight;
    const divRight = divLeft + divWidth;
    const divBottom = divTop + divHeight;
    if(divRight > windowWidth || divBottom > windowHeight){
        const newLeft = Math.min(divLeft, windowWidth - divWidth);
        const newTop = Math.min(divTop, windowHeight - divHeight);
        calDiv.style.left = newLeft + "px";
        calDiv.style.top = newTop + "px";
    }
}



//runs in the cal loop
export function headerCalSquareFillInfo(isClear){
    const cal = document.querySelector(".main-cal-headerCal")
    const calSquares = cal.querySelectorAll(".cal-square");
    const sortedMain = sortByDate(mainTaskArr, false)
    if(isClear){
        calSquares.forEach(square=>{
            const squareNum = square.querySelector(".header-cal-num-tasks");
            squareNum.innerText="";
        })
        clearCalTask(calSquares)
    }
    sortedMain.forEach(task=>{
        calSquares.forEach(square=>{
            const dateArr = [[square.sqDate.getDate(),square.sqDate.getMonth(), square.sqDate.getFullYear()]]
            if(dispDateStrToObjDate(task.due).getTime()===square.sqDate.getTime()){
                square.foundTasks.push(task)
            }
            if(task.repeat){
                const repTask = processRepeat(task, dateArr);
                if(repTask){
                    if(repTask.length>0){
                        square.foundTasks.push(task)
                    }
                }
            }
        })
    })
    calSquares.forEach(square=>{
        square.addEventListener("click",headerSquareFunc)
        if(square.foundTasks.length>0){
            const squareNumDiv = square.querySelector(".header-cal-num-tasks");
            const taskStr = square.foundTasks.length===1?" task":" tasks";
            squareNumDiv.innerText = square.foundTasks.length+ taskStr;
        }

    })
    function headerSquareFunc(e){
        if(e.target.closest(".header-cal-task-box")) return
        clearCalTask(calSquares)
        this.classList.add("active-cal-square")
        const calTaskObj = CreateCalTaskBox(this);
        const calTaskBox = calTaskObj.createToDom();
        setTimeout(()=>calTaskBox.classList.add("header-task-box-active"), 20)
 
    }
function clearCalTask(squares){
    if(document.querySelector(".header-cal-task-box")!==null){
        document.querySelector(".header-cal-task-box").remove()
    }
    squares.forEach(square=>square.classList.remove("active-cal-square"))
}

}

//task row factory for task rows in header cal
function CreateCalTaskBox(sqr){
    function createToDom(){
        const mainDiv = elementCreator("div", ["class", "header-cal-task-box"], false, sqr);
        const upperPart = elementCreator("div", ["class", "header-tb-upper"], false, mainDiv)
        const dateTextDiv = elementCreator("div", ["class","header-tb-date"], dateObjToFullFormatted(sqr.sqDate), upperPart);
        const closeBtn = elementCreator("span",false, "X", upperPart);
        closeBtn.addEventListener("click",()=>{
            sqr.classList.remove("active-cal-square")
            mainDiv.remove()
        })
        const taskCont = elementCreator("div", ["class", "header-tb-task-cont"], false, mainDiv);
        displayTasks(taskCont);
        const btnsDiv = elementCreator("div", ["class", "header-tb-btns-div"], false, mainDiv);
        const goToDate = createGoToDate(btnsDiv, sqr.sqDate, "headerCal");
        const addTask = createAddTaskBtn(btnsDiv)

        return mainDiv;
    }

    function displayTasks(container){
        if(sqr.foundTasks.length>0){
            sqr.foundTasks.forEach(task=>{
                const newTask = elementCreator("div", ["class", "tb-task-row"], task.title, container)
                newTask.taskObj = task;
                newTask.addEventListener("click", createTaskInfo)
            })

        }
    }

    function createAddTaskBtn(parent){
        const addBtn = elementCreator("div", ["class", "tb-add-task"], "+", parent)
        if(!sqr.className.includes("invalid")){
            followMouseHoverText(addBtn, "Add task on this day")
            addBtn.btnDate = sqr.sqDate;
            addBtn.addEventListener("click", makeAdd)
        }
        else{
            addBtn.classList.add("invalid-add-btn-header-cal")
            followMouseHoverText(addBtn, "Date has passed")
        }

    }



    return { createToDom};

}
function createTaskInfo(){
    const taskObj = this.taskObj;
    const square = this.closest(".cal-square");
    const taskCont = this.closest(".header-cal-task-box");
    const taskInfoDiv = elementCreator("div", ["class", "tb-task-info"], false,taskCont);
    const backBtn = elementCreator("span", ["class","tb-info-back-btn"], "↩", taskInfoDiv);
    followMouseHoverText(backBtn, "back");
    const title = elementCreator("div", ["class", "tb-info-title"], taskObj.title, taskInfoDiv);
    const otherElements = elementCreator("div", ["class", "tb-other-div"], false, taskInfoDiv);
    const squareDate = formatNumDate(dateObjToStrDate(square.sqDate), true)
    taskObj.due = squareDate;
    const contentArr = ["Description", "Due", "Date Entered", "Priority","Group", "Completed", "Repeated"]
    const objDataArr = [taskObj.description, taskObj.due, taskObj.dateEntered, taskObj.priority, taskObj.group, taskObj.isComplete, taskObj.repeat]
    objDataArr.forEach((elem, index)=>{
        const container = elementCreator("div", ["class", "tb-info-row"], false, otherElements);
        elementCreator("p", false, contentArr[index], container);
        const info = elementCreator("p", false, elem, container);
        if((index===0 || index===4) && !elem) info.innerText = "None"
        else if(((index===5 || index===6)) && !elem) info.innerText = "No"
    })
    const btnDiv = elementCreator("div", ["class", "tb-btn-div"], false, taskInfoDiv);

    
    backBtn.addEventListener("click", ()=>{
        taskInfoDiv.remove()
        if(document.querySelector(".create-hover-text")!==null){document.querySelector(".create-hover-text").remove()}
    })
}







export function createGoToDate(parent, date, classL){
    const div = elementCreator("div", ["class", `${classL}-go-to`, "tb-go-to-date"], false, parent)
    elementCreator("span", false, "Go to:", div);
    const optionsDiv = elementCreator("div", ["class", "tb-go-options-div"], false, div);
    const btnText = ["day", "week", "month"];
    btnText.forEach((element, index)=>{
        const btn =  elementCreator("div", ["class", "tb-go-btn"], element, optionsDiv)
        if(index!==2)elementCreator("span", false, "/", optionsDiv)
        btn.btnDate = date;
        btn.addEventListener("click", goToDates)
    })
}
function goToDates(){
    //200ms animation on arrow thing was causing a bug when user accidentally double clicks
    this.removeEventListener("click", goToDates)
    setTimeout(()=>{this.addEventListener("click", goToDates)}, 200)

    const [,monthBtn, weekBtn, dayBtn] = document.querySelectorAll(".tf-range-row")
    switch(this.innerText){
        case "day":
            timeframeChange("Day", true)
            const date = dateObjToFullFormatted(this.btnDate, true);
            dayBtn.changeRow(false, date)
            break;
        case "week":
            const strDate = dateObjToStrDate(this.btnDate)
            const from = formatNumDate(recursiveFunc(strDate, false), true) 
            const to = formatNumDate(recursiveFunc(strDate, true), true) 
            timeframeChange("Week", true)
            weekBtn.changeRow(false, [from, to]);
            break;
        case "month":
            timeframeChange("Month", true)
            const mmYY = returnMonth(this.btnDate.getMonth()) + " " + this.btnDate.getFullYear();
            monthBtn.changeRow(false, mmYY)
            break;            
    }
}


















// title bar
function createTitleBar(parent){
    const titleBar = elementCreator("div",["class", "header-cal-title-bar"], false, parent);
    const detachBtn = createDetach();
    const closeBtn = elementCreator("div", ["class", "h-close-btn"], "X", titleBar)
    closeBtn.addEventListener("click", ()=>{
        parent.remove();
        window.removeEventListener("resize", repositionDiv);
    }
        )
    return titleBar;

    function createDetach(){
        const detachDiv = elementCreator("div", ["class", "h-detach-div"], false, titleBar);
        const innerDiv = elementCreator("div", false, false, detachDiv);
        const lowerSquare = elementCreator("div", ["class", "h-detach-lower"],false, innerDiv);
        const upperSquare = elementCreator("div", ["class", "h-detach-upper"], false, innerDiv)
        upperSquare.innerHTML ='&#8599';

        followMouseHoverText(detachDiv, "detach/reattach window")
        detachDiv.addEventListener("click", detachFunc)
        return detachDiv;

        function detachFunc(){
            if(!parent.className.includes("header-cal-detached")){
                parent.classList.add("header-move-anim");
                setTimeout(()=>parent.classList.remove("header-move-anim"), 150)
                parent.classList.add("header-cal-detached");
                titleBar.classList.add("header-title-detached")
                upperSquare.style.transform = 'rotate(180deg)';
                parent.style.right = "100px";
                makeDragFunc(parent, titleBar)
                parent.style.top = "70px";
            }
            else{
                parent.classList.add("header-move-anim");
                setTimeout(()=>parent.classList.remove("header-move-anim"), 150)
                parent.classList.remove("header-cal-detached")
                titleBar.classList.remove("header-title-detached")
                upperSquare.style.transform = 'rotate(0deg)';
                disableDragging(parent, titleBar)

            }
        }
    }
}

function disableDragging(draggableDiv, handleDiv) {
    handleDiv.onmousedown = null;
    draggableDiv.style.right="70px"
    draggableDiv.style.left="auto"
    draggableDiv.style.top="50px";
  }
function makeDragFunc(draggableDiv, handleDiv) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handleDiv.onmousedown = dragMouseDown;
    
    function dragMouseDown(e){
    if(!e.target.className.includes("header-title-detached")) return
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e){
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      let newTop = draggableDiv.offsetTop - pos2;
      let newLeft = draggableDiv.offsetLeft - pos1;
      let maxTop = window.innerHeight - draggableDiv.offsetHeight;
      let maxLeft = window.innerWidth - draggableDiv.offsetWidth;
      let headerHeight = 50;
      if(newTop < headerHeight){
        newTop =headerHeight;
      } 
      else if(newTop> maxTop){
    newTop = maxTop;
      }
      if (newLeft < 0){
        newLeft = 0;
      } 
      else if (newLeft > maxLeft){
        newLeft = maxLeft;
      }
      draggableDiv.style.top = newTop + "px";
      draggableDiv.style.left = newLeft+ "px";
    }
  
    function closeDragElement(){
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }