import { mainTaskArr } from '../state';
import { dispDateStrToObjDate } from '../utilities/dateUtils';
import { elementCreator } from '../utilities/elementCreator';
import { createGoToDate } from './headerCal/headerCal';
import '/src/Header/searchBar.css'
export function searchLoupe(btn, input){
    btn.addEventListener("click", ()=>{input.focus()})
}


function taskFinder(val){
    const foundArr = [];
    mainTaskArr.forEach(task=>{
        const taskTitle = searchProof(task.title);
        const value = searchProof(val);
        const dueVal = searchProof(task.due);
        if(taskTitle.includes(value)){
            foundArr.push(task);
        }
        else if(dueVal.includes(value)){
            foundArr.push(task);
        }
     
    })
    return foundArr

    function searchProof(str){
        return str.toLowerCase().replaceAll(/[\s]/g, "").replaceAll(/[^a-zA-Z1-9]/g, ' ')
    }

}






function renderSearchTasks(menu, taskArr){
    clearMenu(menu);
    if(taskArr.length===0){
        elementCreator("div", ["class", "search-menu-no-tasks"], "No tasks found...", menu);
    }
    else{
        const taskNumStr = taskArr.length>1?" tasks found":" task found";
        const taskNum = elementCreator("div", ["class", "s-menu-task-num"], taskArr.length + taskNumStr, menu)
        const taskCont = elementCreator("div", ["class", "s-row-container"], false, menu)
        taskArr.forEach(task=>{
            const row = SearchRowFact(task, taskCont);
            row.createRow()
        })
    }
}


function SearchRowFact(task, menu){
    let row, upper, lower;
    function createRow(){
        row = elementCreator("div", ["class", "s-menu-row"],  false, menu);
        upper = elementCreator("div", ["class", "s-menu-upper"], false, row)
        const title = elementCreator("div", false, task.title,upper);
        const due = elementCreator("div", false,task.due,upper);
        const goToDate = createGoToDate(upper, dispDateStrToObjDate(task.due), "searchBar")
        lower = elementCreator("div", ["class", "s-menu-lower", "s-menu-hidden"], false, row);
        const lowerContent = [task.group, task.priority, task.repeat, task.isComplete];
        const lowerLabel = ["Group:", "Priority:", "Repeat:", "Status:"]
        lowerContent.forEach((content, index)=>{
            let str;
            if(!content){
                if(index===0) str = "No group"
                if(index===2) str = "Not repeated"
                if(index===3) str = "Task not completed"
            }
            else if(index===3 && content) str ="Task completed";
            else if(index===1){
                str = (content.charAt(0).toUpperCase() + content.slice(1)) + " priority";
            }
            else str = content
            const lowerElementDiv = elementCreator("div", ["class", "s-lower-element"], false, lower)
            elementCreator("span", false, lowerLabel[index], lowerElementDiv )
            elementCreator("p", false, str, lowerElementDiv)
            row.addEventListener("click", searchRowFunc)
        })

    function searchRowFunc(e){
        if(e.target.className.includes("tb-go-btn")) return
        if(lower.className.includes("s-menu-hidden")){
            closeAll()
            lower.classList.remove("s-menu-hidden")
        }
        else{
            closeAll()
        }
    }

    function closeAll(){
        menu.querySelectorAll(".s-menu-lower").forEach(elem=>{
            elem.classList.add("s-menu-hidden")
        })
    }
        
    }

    return {row, createRow};
}




function clearMenu(menu){
    menu.querySelectorAll("div").forEach(elem=>elem.remove())
}




export function inputBehaviour(searchDiv){
    const input = searchDiv.querySelector("#header-input");
    const menu = searchDiv.querySelector(".search-bar-menu");

    input.addEventListener("input", inputTaskSearch)


    function inputTaskSearch(e){
        if(this.value.length>0) openMenu()
        else{
            closeMenu();
            return;
        }
        const foundTasks = taskFinder(e.target.value);
        renderSearchTasks(menu, foundTasks)

    }
    
    function closeMenu(){
        menu.classList.remove("search-bar-menu-shown")
        clearMenu(menu)
        window.removeEventListener("click", closeFromClick);


    }
    function openMenu(){
        menu.classList.add("search-bar-menu-shown");
        window.addEventListener("click", closeFromClick);
    }

    function closeFromClick(e){
        if(!e.target.closest(".searchbar-div")){
            window.removeEventListener("click", closeFromClick);
            input.value = "";
            closeMenu()
            inputClose();
            focusOut()
        }
    }


    window.addEventListener("keydown", clearEscapeSearch)

    function clearEscapeSearch(e){
        if(e.key==="Delete"){
            input.value="";
        }
        else if(e.key==="Escape"){
            input.value="";
            inputClose();
            focusOut();
        }
    }

    input.addEventListener("focus", ()=>{
        input.style.width="100%";

    });

    input.addEventListener("focusout", inputClose);

    function inputClose(){
        if(input.value.length<1){
            input.style.width="30px";
            window.removeEventListener("keydown", inputClose)
        }

    };
    function focusOut(){
        let fakeInput = document.createElement("input");
        document.body.appendChild(fakeInput);
        fakeInput.focus();
        fakeInput.remove();
        closeMenu()
    }
}