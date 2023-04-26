import { createHeaderDom } from '../Header/createHeader';
import { readUserGroupsServer, readUserTasksServer } from '../firebase';
import { isLogged, currentTheme, modifyTheme, changeDocumentTheme, mainGroupArr,updateGroupsLocal, mainTaskArr, updateTasksLocal, timeframeChange, timeframeOption } from '../state';
import { createTimeframeDiv } from '../timeframe/createTimeframe';
import { createTimeSpan } from '../timeframe/createTimeSpanDiv';
import { createEmptyMessage, createTaskDisplay } from '../taskDisp/createTaskDisp';
import { elementCreator } from '../utilities/elementCreator';
import { fillAllCalSquares } from '../singleRowCal/singleRowAll';
import { createFilterOptions } from '../filterOptions/filterOptions';

export function createMainPageDom(){
    readTheme();
    const bodyUpperDiv = elementCreator("div", ["id", "main-upper-div"], false, document.body);
    createHeaderDom(bodyUpperDiv);
    readTasksGroups();

    readTimeframe(bodyUpperDiv);
    createTimeframeDiv(bodyUpperDiv);

    createFilterOptions(bodyUpperDiv);

    createTaskDisplay();

    if(timeframeOption==="All"){
       fillAllCalSquares(true);
    }

    //testing
    document.querySelector(".main-title").addEventListener("click", ()=>{
        console.log("tasks:");
        console.log(mainTaskArr);
        console.log("groups:");
        console.log(mainGroupArr);
    })

}


function readTasksGroups(){
    //reads user group and task in firebase and copies its value to mainGroupArr/task in state if available
    if(isLogged){
        readUserGroupsServer();
        readUserTasksServer();
    }
    //gets local "groups" and tasks in state and copies to mainGroupArr/task in state if available
    else{
        updateTasksLocal();
        updateGroupsLocal();
    }
}
function readTheme(){
    //theme (always local)
    if(localStorage.getItem("theme")!==null){
        modifyTheme(localStorage.getItem("theme"))
        changeDocumentTheme(currentTheme)
    }
    else{
        changeDocumentTheme("light-theme")
    }
}

function readTimeframe(){
    if(localStorage.getItem("timeframe-option")===null){
        timeframeChange("Week")
    }
    else{
        timeframeChange(localStorage.getItem("timeframe-option"))
    }

}

