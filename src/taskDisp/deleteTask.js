import { headerCalSquareFillInfo } from "../Header/headerCal/headerCal";
import { writeUserTasksServer } from "../firebase";
import { addNewTaskLocal, isLogged, mainTaskArr } from "../state";
import { createBodyModal } from "../utilities/bodyModal";
import { elementCreator } from "../utilities/elementCreator";
import { createTaskDisplay, renderTasks } from "./createTaskDisp";

export function deleteTaskFunc(){
    const taskObj = this.btnObj;
    const deleteDiv = elementCreator("div", ["class", "delete-task-div"], false, document.body);
    const hoverDiv = createBodyModal(deleteDiv);
    hoverDiv.createDiv();
    if(!taskObj.repeat){
        elementCreator("p", false, "Are you sure you want to remove this task?", deleteDiv);
        const btn = elementCreator("div", ["class" ,"delete-btn-task"], "Delete task", deleteDiv);
        btn.addEventListener("click", deleteSingleTask);
        btn.isRep = false;
    }
    else{
        elementCreator("p", false, "Delete all repeated tasks or only this one?", deleteDiv);
        const btnCont = elementCreator("div", false, false, deleteDiv)
        const btnAll = elementCreator("div", ["class" ,"delete-btn-task"], "All tasks", btnCont);
        const btnOne = elementCreator("div", ["class" ,"delete-btn-task"], "This task", btnCont);
        btnAll.isRep = true;
        btnAll.addEventListener("click", deleteSingleTask);
        btnOne.addEventListener("click", deleteSingleRepTask)
    }



    function deleteSingleTask(){
        const taskID = this.isRep?taskObj.originalID:taskObj.uniqueID;
        const index = findIndexOfTask(taskID);
        mainTaskArr.splice(index, 1);
        isLogged?writeUserTasksServer(mainTaskArr):addNewTaskLocal();
        createTaskDisplay();
        hoverDiv.closeDiv();
    }

    function deleteSingleRepTask(){
        const index = findIndexOfTask(taskObj.originalID);
        const keyValue = taskObj.due.replaceAll("/", "s");
        mainTaskArr[index].repeatException[keyValue] = taskObj.due
        isLogged?writeUserTasksServer(mainTaskArr):addNewTaskLocal();
        createTaskDisplay();
        hoverDiv.closeDiv();
    }
}



function findIndexOfTask(uID){
    let index;
    mainTaskArr.forEach((task, i)=>{
        if(task.uniqueID===uID){
            index=i;
            return
        }
    })
    return index;
}

