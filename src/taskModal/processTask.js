import { addZeroDispDate, getToday } from "../utilities/dateUtils";
import { mainTaskArr, isLogged } from "../state";
import { writeUserTasksServer } from "../firebase";
import { createBodyModal } from "../utilities/bodyModal";
import { createTaskDisplay } from '/src/taskDisp/createTaskDisp';
export function processTask(){
    const [titleDiv, descDiv, dueDiv, groupDiv, priorityDiv, repeatDiv, notesDiv,] = this.parentElement.childNodes;

    if(!validateTitle(titleDiv))return
    if(!isPrioEmpty(priorityDiv))return

    const obj = {};
    
    //title
    obj.title = titleDiv.querySelector(".modal-input").textContent;

    //description
    const description = descDiv.querySelector(".modal-input").textContent;
    obj.description = description.length===0?false:description;
    if(obj.description==="\n") obj.description=false; //needed for firefox and safari for some reason

    //due
    const dueDate = dueDiv.querySelector(".add-btn-due").innerText;
    obj.due = dueDate==="Today"?addZeroDispDate(getToday(false, true)):dueDate;
  


    //group
    const group = groupDiv.querySelector(".add-btn-group").innerText
    obj.group = group==="None"?false:group;
    //priority
    const priority = priorityDiv.querySelector(".prio-back-div");
    obj.priority = priority.classList[1].split("-").pop();
    //repeat
    const repeat = repeatDiv.querySelector(".add-btn-repeat").innerText
    console.log();
    obj.repeat= repeat==="No repeat"?false:repeat;
    console.log(obj.repeat);
    //notes
    const notes = notesDiv.querySelector(".add-btn-notes").innerText
    obj.notes = notes==="None"?false:notes;

    //id, not sure if it's the right way to do it 
    obj.uniqueID = createID();
    //date of task entry
    obj.dateEntered = getToday(false, true);

    //isPast, plan is each time a user logs in the program will check if the task due has passed and update accordingly
    obj.isPast = false;

    //user can update isComplete through the task element itself
    obj.isComplete = false;
    mainTaskArr.push(obj);
    if(isLogged){
        writeUserTasksServer(mainTaskArr)
    }
    else{
        localStorage.setItem("tasks", JSON.stringify(mainTaskArr));
    }


    const bgModal = createBodyModal(this.parentElement.parentElement);
    bgModal.closeDiv();
    createTaskDisplay()
 
}







function isPrioEmpty(prioDiv){
    const backDiv = prioDiv.querySelector(".prio-back-div");
    if(backDiv.classList.length<2){
        prioDiv.classList.add("invalid-modal-element")
        setTimeout(()=>{prioDiv.classList.remove("invalid-modal-element")}, 2000)
        return false
    }
    return true;
}

function validateTitle(titleDiv){
    const input = titleDiv.querySelector(".modal-input");
    if(input.textContent.length===0){
        input.classList.add("invalid-modal-element")
        setTimeout(()=>{input.classList.remove("invalid-modal-element")}, 2000)
        return false
    }
    return true;
}
    
    
    
    
export function createID(){
    const arr=[];
    for(let i=0;i<10;i++) arr.push(Math.floor(Math.random()*10));
    const now = new Date();
    const timeStuff = [now.getHours(), now.getMinutes(), now.getSeconds(), now.getDate(), now.getMonth(), now.getFullYear()];
    timeStuff.forEach((time, i)=>arr.push(timeStuff[i]));
    return arr.join("");
}