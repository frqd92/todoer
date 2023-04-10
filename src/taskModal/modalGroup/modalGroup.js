import { writeUserGroups } from '../../firebase';
import { elementCreator } from '../../utilities/elementCreator';
import { mainGroupArr, isLogged, addNewGroupLocal } from '../../state';

import '/src/taskModal/modalGroup/modalGroup.css'

export function createModalGroup(){
    const groupDiv = elementCreator("div", ["class", "add-group"], false, false);
    const emptyDiv = elementCreator("div", ["class", "group-no-group"], "Group list empty.", groupDiv);
    const groupRowDiv = createGroupListDiv(groupDiv);

    if(mainGroupArr.length<1){//if empty
        emptyDiv.classList.add("no-group-show");
        groupRowDiv.classList.add("group-row-hide")
    }
    const addBtn = elementCreator("div", ["class", "add-group-btn"], "Add a new group", groupDiv);
    addBtn.addEventListener("click",groupInputFunc,{once:true});
    return groupDiv
}

function createGroupListDiv(parent){
    const div = elementCreator("div", ["class", "add-group-list-div"], false, parent);
    const searchInput = elementCreator("input", ["class", "group-search-input"], false, div);
    searchInput.placeholder = "Search groups";
    const listDiv = elementCreator("div", ["class", "add-group-list"], false, div);
    if(mainGroupArr.length>0)createGroupRows(listDiv);
    searchInput.addEventListener("input", groupSearchFunc);
    return div;

}

function groupSearchFunc(){
    const menu = this.parentElement.parentElement;
    const rows = menu.querySelectorAll(".add-row-div");
    const val = this.value.toLowerCase().replace(/\s/g,'');
    rows.forEach(row=>{
        const rowVal = row.querySelector("p").innerText.toLowerCase().replaceAll(/\s/g,'');
        row.style.display = rowVal.includes(val)?"grid":"none"
    })
}

    
function createGroupRows(listDiv){
    clearGroupRows(listDiv);
    mainGroupArr.forEach(group=>{
        const rowDiv = elementCreator("div", ["class", "add-row-div"], false, listDiv, true);
        const groupText = elementCreator("p", false, group, rowDiv);
        const delBtn = elementCreator("div", ["class", "add-row-del"], "X", rowDiv);
    })
    const menu = listDiv.parentElement.parentElement;
    const addNewGroupBtn = menu.querySelector(".add-group-btn");
    if(addNewGroupBtn!==null){
        addNewGroupBtn.classList.remove("disabled-group-btn")
    }
}
function groupInputFunc(){
    this.classList.add("disabled-group-btn");
    const inputDiv = elementCreator("div",["class", "add-group-input-div"], false, this.parentElement);
    const input = elementCreator("input", false, "Enter new group name", inputDiv, false, true);
    const addBtn = elementCreator("div", false, "⮕", inputDiv);
    input.focus();
    addBtn.addEventListener("click", addNewGroup);
    window.addEventListener("keydown", addNewGroupEnter)
}
function addNewGroupEnter(e){

    if(e.key==="Enter"){
        if(addNewGroup(e, true)){
            window.removeEventListener("keypress", addNewGroupEnter)
        }
    }
    else if(e.key==="Escape"){
        const inputDiv = document.querySelector(".add-group-input-div");
        if(inputDiv!==null){
            const addInputDivBtn = inputDiv.parentElement.parentElement.querySelector(".add-group-btn");
            addInputDivBtn.addEventListener("click",groupInputFunc,{once:true});
            inputDiv.remove()
            addInputDivBtn.classList.remove("disabled-group-btn");
        }
    }
}

function addNewGroup(e, isEnter){
    let inputDiv;
    if(isEnter){
        inputDiv = document.querySelector(".add-group-input-div");
    }
    else{
        inputDiv = this.parentElement;
    }
    if(inputDiv===null)return;
    const emptyDiv =inputDiv.parentElement.querySelector(".group-no-group");
    const input = inputDiv.querySelector("input");

    if(validateGroupInput(input)){
        mainGroupArr.push(input.value);

        if(!isLogged){addNewGroupLocal()}
        else{writeUserGroups(mainGroupArr)}

        const listDiv = inputDiv.parentElement.querySelector(".add-group-list");
        const listDivDiv = listDiv.parentElement;
        emptyDiv.classList.remove("no-group-show");
        listDivDiv.classList.remove("group-row-hide");
        createGroupRows(listDiv);
        inputDiv.remove();

        const addInputDivBtn = listDivDiv.parentElement.querySelector(".add-group-btn");
        addInputDivBtn.addEventListener("click",groupInputFunc,{once:true});
        e.stopPropagation();
        return true;
    }
    else{
        return false;
    }

}





function clearGroupRows(listDiv){
    listDiv.parentElement.querySelector(".group-search-input").value="";
    const rows = listDiv.querySelectorAll("div")
    rows.forEach(row=>{row.remove()});



}

function validateGroupInput(input){
    if(input.value.length<1){
        input.placeholder = "Field cannot be empty";
        return false;
    }
    else if(input.value.length>50){
        input.value="";
        input.placeholder = "Max 50 characters";
        return false;
    }
    return true;
}