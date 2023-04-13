
//is user logged in
export let isLogged = false;
export function isLoggedModify(bool){
    isLogged = bool;
}

//timeframe
export let timeframeOption = "Week";

export function timeframeChange(val, changeLocal){
    if(changeLocal)localStorage.setItem("timeframe-option", val); 
    
    timeframeOption=val;
}



//tasks
export let mainTaskArr = [];

export function modifyTasksArr(arr){
    mainTaskArr=arr;
}
export function updateTasksLocal(){
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    if(tasks!==null){mainTaskArr = tasks}
}

export function addNewTaskLocal(){
    localStorage.setItem("tasks", JSON.stringify(mainTaskArr))
}
export function addNewTaskServer(arr){

}
//groups
export let mainGroupArr = [];
export function modifyGroupsArr(arr){
    mainGroupArr = arr;
}
export function updateGroupsLocal(){
    const groups = JSON.parse(localStorage.getItem("groups"));
    if(groups!==null){
        mainGroupArr=groups;
    }
}
export function addNewGroupLocal(){
    localStorage.setItem("groups", JSON.stringify(mainGroupArr))
}



//theme
export let currentTheme = "light-theme";
export function modifyTheme(val){
    currentTheme = val;
}
export function changeDocumentTheme(val){
    document.documentElement.className = val;
}
