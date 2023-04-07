import { writeUserGroups } from '../../firebase';
import { elementCreator } from '../../utilities/elementCreator';
import { mainGroupArr, modifyGroupsArr, isLogged } from '../../state';

import '/src/taskModal/modalGroup/modalGroup.css'

export function createModalGroup(){
    const groupDiv = elementCreator("div", ["class", "add-group"], false, false);

    const groupArr = [];
    //reads group, if available make a copy in groupArr
    if(groupArr.length<1){//if empty
        const emptyDiv = elementCreator("div", ["class", "group-no-group"], "Group list empty.", groupDiv);
    }
    else{
        createGroupListDiv(groupDiv, groupArr);
    }
    const addBtn = elementCreator("div", ["class", "add-group-btn"], "Add a new group", groupDiv);
    addBtn.addEventListener("click", (e)=>{
        groupInputFunc(e, groupDiv)
    }, {once:true});
    return groupDiv
}

function createGroupListDiv(parent, groupArr){
    const div = elementCreator("div", ["class", "add-group-list-div"], false, parent);
    const searchInput = elementCreator("input", false, div);
    const listDiv = elementCreator("div", ["class", "add-group-list"], false, div);

}

function groupInputFunc(e, parent){
    const inputDiv = elementCreator("div",["class", "add-group-input-div"], false, parent);
    const input = elementCreator("input", false, "Enter new group name", inputDiv, false, true);
    const addBtn = elementCreator("div", false, "⮕", inputDiv);
    input.focus();
    addBtn.addEventListener("click", addNewGroup);
}
function addNewGroup(){
    const inputDiv = this.parentElement;
    const input = inputDiv.querySelector("input");
    if(input.value.length<1){
        input.placeholder = "Field cannot be empty";
        return
    }
    else if(input.value.length>50){
        input.value="";
        input.placeholder = "Max 50 characters";
        return
    }
    mainGroupArr.push(input.value);
    if(isLogged){
        writeUserGroups(mainGroupArr);
    }
    else{
        localStorage.setItem("groups", JSON.stringify(mainGroupArr))
    }

    

}