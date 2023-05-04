import { writeUserGroupsServer } from '../../firebase';
import { elementCreator } from '../../utilities/elementCreator';
import { mainGroupArr, isLogged, addNewGroupLocal } from '../../state';

import '/src/taskModal/modalGroup/modalGroup.css'
import { closeMenuOutside } from '../createModal';

export function createModalGroup(outputBtn){
    const groupDiv = elementCreator("div", ["class", "add-group"], false, false);
    const emptyDiv = elementCreator("div", ["class", "group-no-group"], "Group list empty.", groupDiv);
    const groupRowDiv = createGroupListDiv(groupDiv, outputBtn);

    if(mainGroupArr.length<1){//if empty
        emptyDiv.classList.add("no-group-show");
        groupRowDiv.classList.add("group-row-hide")
    }
    const addBtn = elementCreator("div", ["class", "add-group-btn"], "Add a new group", groupDiv);
    addBtn.addEventListener("click",groupInputFunc,{once:true});
    return groupDiv
}

function createGroupListDiv(parent, outputBtn){
    const div = elementCreator("div", ["class", "add-group-list-div"], false, parent);
    const searchInput = elementCreator("input", ["class", "group-search-input"], false, div);
    searchInput.placeholder = "Search groups";
    const listDiv = elementCreator("div", ["class", "add-group-list"], false, div);
    if(mainGroupArr.length>0)createGroupRows(listDiv, outputBtn);
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

    
function createGroupRows(listDiv, outputBtn){
    clearGroupRows(listDiv);
    mainGroupArr.forEach(group=>{
        const rowDiv = elementCreator("div", ["class", "add-row-div"], false, listDiv, true);
        const groupText = elementCreator("p", false, group, rowDiv);
        const delBtn = elementCreator("div", ["class", "add-row-del"], "X", rowDiv);
        groupText.addEventListener("click", rowGroupToBtn);
        delBtn.addEventListener("click", removeGroup);
    })
    const menu = listDiv.parentElement.parentElement;
    const addNewGroupBtn = menu.querySelector(".add-group-btn");
    if(addNewGroupBtn!==null){
        addNewGroupBtn.classList.remove("disabled-group-btn")
    }
    function rowGroupToBtn(){
        outputBtn.innerText = this.innerText;
        closeMenuOutside(this.closest(".add-menu"));
    }
}
function removeGroup(e){
    const groupText = this.previousSibling.innerText;
    const index = mainGroupArr.indexOf(groupText);
    mainGroupArr.splice(index, 1)
    this.parentElement.remove()
    isLogged?writeUserGroupsServer(mainGroupArr):addNewGroupLocal()
    e.stopPropagation()

    if(mainGroupArr.length<1){
        const parentRow = document.querySelector(".add-group")
        const emptyDiv = parentRow.querySelector(".group-no-group");
        const groupRowDiv = parentRow.querySelector(".add-group-list-div")
        emptyDiv.classList.add("no-group-show");
        groupRowDiv.classList.add("group-row-hide")
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
    input.value = input.value.trim()
    if(validateGroupInput(input)){
        mainGroupArr.push(input.value);

        if(!isLogged){addNewGroupLocal()}
        else{writeUserGroupsServer(mainGroupArr)}

        const listDiv = inputDiv.parentElement.querySelector(".add-group-list");
        const listDivDiv = listDiv.parentElement;
        emptyDiv.classList.remove("no-group-show");
        listDivDiv.classList.remove("group-row-hide");
        const outputBtn = listDivDiv.parentElement.parentElement.parentElement.querySelector(".add-btn-group")
        createGroupRows(listDiv, outputBtn);
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
    const duplicateCheck = mainGroupArr.every(group=>group.toLowerCase()!==input.value.toLowerCase());
    if(!duplicateCheck){
        input.value="";
        input.placeholder = "Group already exists";
        return false;
    }
    return true;
}