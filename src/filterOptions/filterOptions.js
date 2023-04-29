import { isLogged, mainGroupArr } from '../state';
import { createTaskDisplay } from '../taskDisp/createTaskDisp';
import { elementCreator } from '../utilities/elementCreator'
import { followMouseHoverText } from '../utilities/hoverDiv';
import '/src/filterOptions/filterOptions.css'

export const settingsObj = {
    sort: false,
    filter: {
        completed: true,
        incomplete: true,
        repeated: true,
        normal: true,
        high: true,
        highest: true
    }
}
export function createFilterOptions(parent){
    const filterOptionsDiv = elementCreator("div", ["class", "filter-options-div"], false, parent);

    const filterBtn = createFilterBtn(filterOptionsDiv);
    const settingsDiv = createSettingsDiv(filterOptionsDiv)
    settingsDiv.style.display="none";
}



function createFilterBtn(par){
    const filterBtnDiv = elementCreator("div", ["class", "f-main-btn-div"], false, par);
    const filterBtn = elementCreator("div", ["class", "f-filterMenu-btn"], false, filterBtnDiv);
    for(let i=0;i<3;i++){elementCreator("div", ["class", `op-line-${i}`], false, filterBtn)};
    optionsBtnEffect(filterBtn);
    return filterBtnDiv
}


function createSettingsDiv(par){
    const settingsDiv =  elementCreator("div", ["class", "f-settings-div", "f-settings-hidden"],false, par);
    const sortDiv = createSortDiv(settingsDiv);
    const filterDiv = createFilterDiv(settingsDiv);
    const groupsDiv = createGroupsDiv(settingsDiv);
    const collExpDiv = createCollExpDiv(settingsDiv);
    return settingsDiv;
}

function createGroupsDiv(par){
    const mainGroupDiv = elementCreator("div", ["class", "f-group-main-div"], false, par);
    const groupBtn = elementCreator("div", ["class", "f-group-btn"], "Filter by group", mainGroupDiv);
    const menu = elementCreator("div", ["class", "f-group-menu", "f-menu-hidden"], false, mainGroupDiv);
    settingsMenuFunc(groupBtn, menu);

    const input = elementCreator("input", ["class", "f-search-input"], "Search groups", menu, false, true);
    const groupCont = elementCreator("div", ["class", "f-group-row-div"], false, menu);
    const btnsDiv = elementCreator("div", ["class", "f-group-btns-div"], false, menu);
    const selectAll = elementCreator("div", false, "Select all", btnsDiv);
    const deselectAll = elementCreator("div", false, "Deselect all", btnsDiv);
    selectAll.isSel = true;
    deselectAll.isSel = false;
    mainGroupDiv.addEventListener("click", groupFunc)
    selectAll.addEventListener("click", selectFunc)
    deselectAll.addEventListener("click", selectFunc)

    function selectFunc(){
        groupCont.childNodes.forEach(row=>{
            if(row.className.includes("f-group-not-disp")) return
            if(this.isSel){
                row.classList.add("f-selected-group");
                row.querySelector("span").classList.remove("f-inner-hidden")
            }
            else{
                row.classList.remove("f-selected-group");
                row.querySelector("span").classList.add("f-inner-hidden")
            }
        })  
        filterGroupsFunc()
    }




    input.addEventListener("input", (e)=>{
        const inputVal = e.target.value.toLowerCase().replaceAll(/[\s]/g,"");
        groupCont.childNodes.forEach(row=>{
            const group = row.querySelector("p").innerText.toLowerCase().replaceAll(/[\s]/g,"");
            if(!group.includes(inputVal)){row.style.display="none"}
            else{row.style.display="flex"};
        })
    })

    function groupFunc(e){
        if(e.target.closest(".f-group-menu")) return
        if(!this.className.includes("f-group-open")){
            this.classList.add("f-group-open")
            generateGroups();
        }
        else{
            this.classList.remove("f-group-open")
        }
    }

    function generateGroups(){
        groupCont.querySelectorAll("div").forEach(div=>{div.remove()})
        if(mainGroupArr.length>0){
            mainGroupArr.forEach(group=>{
                const isDisp = checkIfGroupIsInDisp(group)
                const groupRow = GroupRowFact(group, isDisp);
                if(isDisp){groupCont.prepend(groupRow)}
                else{ groupCont.appendChild(groupRow)}
            })
        }
        else{elementCreator("div", ["class", "f-no-group-msg"], "Your group list is empty", groupCont)}
        filterGroupsFunc()
    }

    function GroupRowFact(groupName, isDisp){
        const row = elementCreator("div", ["class", "f-group-row"], false, false);
        const text = elementCreator("p", false, groupName, row);
        const outer = elementCreator("div", false, false, row);
        const inner = elementCreator("span", false, "✓", outer);
        inner.classList.add("f-inner-hidden")
        if(!isDisp){
            row.classList.add("f-group-not-disp")
            followMouseHoverText(row, "No tasks with this group in current date range")
        }
        else{
            row.addEventListener("click", selectDesRow);

        }
        return row;

        function selectDesRow(){
            if(!this.className.includes(("f-selected-group"))){
                this.classList.add("f-selected-group")
                inner.classList.remove("f-inner-hidden")
            }
            else{
                this.classList.remove("f-selected-group")
                inner.classList.add("f-inner-hidden")
            }
            filterGroupsFunc();
        }
    }
    function filterGroupsFunc(){
        const allTasks = document.querySelectorAll(".task-row-main");
        const allSelected = groupCont.querySelectorAll(".f-selected-group");
        const allTotal = groupCont.querySelectorAll(".f-group-row");
        if(allSelected.length===0 || allSelected.length===allTotal.length){
            allTasks.forEach(task=>{
                task.style.display="block"
                task.classList.remove("filtered-group-task");
            })
            checkGroupVisibility()
            return;
        }
        const shownGroups = [];
        groupCont.childNodes.forEach(row=>{
            if(row.className.includes("f-selected-group")){
                const filterGroup = row.querySelector("p").innerText;
                allTasks.forEach(task=>{
                    const taskGroup = task.objFilter.group;
                    if(filterGroup===taskGroup){
                        shownGroups.push(taskGroup);
                    }
                })
            }
        })

        allTasks.forEach(task=>{
            if(shownGroups.includes(task.objFilter.group)){
                task.style.display="block";
                task.classList.remove("filtered-group-task");
            }
            else{
                task.style.display="none"
                task.classList.add("filtered-group-task");
                console.log(task);

            }
        })
        checkGroupVisibility()
        function checkGroupVisibility(){

            document.querySelectorAll(".td-grouped").forEach(group=>{
                console.log(group);
                const allRows = group.querySelectorAll(".task-row-main");
                const allFiltered = group.querySelectorAll(".filtered-group-task")
    
                if(allRows.length === allFiltered.length && allFiltered.length>0){
                    group.classList.add("hide-group-filter");
                }
                else{
                    group.classList.remove("hide-group-filter");
                }
            })
        }

    }


    function checkIfGroupIsInDisp(groupFromMain){
        const allDispGroups = document.querySelectorAll(".tr-group");
        let isDisp = false;
        allDispGroups.forEach(taskGroup=>{
            if(taskGroup.innerText!=="No group"){
                if(taskGroup.innerText===groupFromMain){
                    isDisp=true;
                }
            }
        })
        return isDisp;
    }
    return mainGroupDiv;
    
}






function createFilterDiv(par){
    const mainFilterDiv = elementCreator("div", ["class", "f-filter-main-div"], false, par);
    const filterBtn = elementCreator("div", ["class", "f-filter-btn"], "Show", mainFilterDiv);
    const menu = elementCreator("div", ["class", "f-filter-menu", "f-menu-hidden"], false, mainFilterDiv);
    const contentArr = ["Completed", "Incomplete", "Repeated", "Normal", "High", "Highest"]
    for(let i=0;i<6;i++){
        const row = elementCreator("div", ["class", "f-row", "f-row-checked"], false,menu);
        const text = elementCreator("p", ["class", "f-row-text"], contentArr[i], row);
        const checkBox = createCheckboxFilter(row);
        if(i===2) elementCreator("div", ["class", "f-row-prio-text"],"Priority", menu)
        if(i===5){
            const showAllBtn = elementCreator("div", ["class", "f-show-all-btn"], "Show all", menu)
            showAllBtn.addEventListener("click", showAll)
        }
    }
    settingsMenuFunc(filterBtn, menu)
    
    function showAll(){
        document.querySelectorAll(".f-row").forEach(elem=>{
            const inner = elem.querySelector(".f-check-inner");
            elem.classList.add("f-row-checked")
            inner.style.opacity=1;
        })
        for(let [key] of Object.entries(settingsObj.filter)){
            settingsObj.filter[key]=true;
        }
        createTaskDisplay()
    }
    return createFilterDiv;
}

function createCheckboxFilter(par){
    const outer = elementCreator("div", ["class", "f-check-outer"], false, par);
    const inner = elementCreator("span", ["class", "f-check-inner"], "✓", outer);
    par.addEventListener("click", markCheck);

    function markCheck(){
  
        const text = this.querySelector(".f-row-text").innerText.toLowerCase();
        if(par.className.includes("f-row-checked")){
            par.classList.remove("f-row-checked");
            inner.style.opacity = "0";
            settingsObj.filter[text]=false;
        }
        else{
            par.classList.add("f-row-checked");
            inner.style.opacity = "1";
            settingsObj.filter[text]=true;
        }
        checkityCheck(this);
        createTaskDisplay()
    }
    //so users cant deselect both complete and incomplete, or all 3 priorities
    function checkityCheck(btn, obj){
        const allBtns = document.querySelectorAll(".f-row");
        const [completed, incomplete, , normal, high, highest] = allBtns;
        const inners = document.querySelectorAll(".f-check-inner");
        
        if(btn===completed || btn===incomplete){
            if(!completed.className.includes("f-row-checked") && !incomplete.className.includes("f-row-checked")){
                if(btn===completed){
                    inners[1].style.opacity = "1";
                    incomplete.classList.add("f-row-checked")
                    settingsObj.filter.incomplete = true;
                }
                else{
                    inners[0].style.opacity = "1";
                    completed.classList.add("f-row-checked")
                    settingsObj.filter.completed = true;

                }
            }
        }
        if(btn===normal || btn===high || btn===highest){
            const arr = [normal, high, highest];
            let count = 0;
            arr.forEach(elem=>{
                if(!elem.className.includes("f-row-checked")) count++ 
            })
            if(count===3){
                btn.classList.add("f-row-checked");
                btn.querySelector(".f-check-inner").style.opacity = "1";
                const text = btn.querySelector(".f-row-text").innerText.toLowerCase();
                settingsObj.filter[text] = true;
            }
        }
    }
}



function settingsMenuFunc(btn, menu){
        btn.addEventListener("click", showHideMenu);
        function showHideMenu(){
            if(menu.className.includes("f-menu-hidden")){
                menu.classList.remove("f-menu-hidden")
                window.addEventListener("click", hideMenu);
            }
            else{
                menu.classList.add("f-menu-hidden")
                window.removeEventListener("click", hideMenu);
            }
        }
        function hideMenu(e){
            const parentClass = menu.parentElement.classList[0];
            if(!e.target.closest("."+parentClass)){
                menu.classList.add("f-menu-hidden")
                window.removeEventListener("click", hideMenu);
                btn.parentElement.classList.remove("f-group-open")
            }
        }
}




function createCollExpDiv(settingsDiv){
    const collExpDiv = elementCreator("div", ["class", "f-collExp"], false, settingsDiv);

    const left = elementCreator("div", ["class", "f-collExp-left"], false, collExpDiv);
    elementCreator("span", false, "Collapse all", left);
    const collArrs = createCollArrows(true, left);
    elementCreator("p", false, false, collExpDiv)
    const right = elementCreator("div", ["class", "f-collExp-right"], false, collExpDiv);
    elementCreator("span", false, "Expand all", right);
    const expArrs = createCollArrows(false, right);
    left.collapse = true;
    right.collapse = false;
    left.addEventListener("click", collExpAllFunc)
    right.addEventListener("click", collExpAllFunc)
    return collExpDiv;

    function collExpAllFunc(){
        const allGroups = document.querySelectorAll(".td-grouped");
        allGroups.forEach(group=>{
            this.collapse?group.closeFunc():group.openFunc();
        })
    }

    function createCollArrows(bool, parDiv){
        const arrDiv = elementCreator("div", ["class", "f-collExp-arrow-div"], false, parDiv);
        const arr = bool?["↑", "↓"]:["↓","↑"];
        elementCreator("span", false, arr[0], arrDiv);
        elementCreator("span", false, arr[1], arrDiv);
        return arrDiv
    }


}
function createSortDiv(par){
    const sortDiv = elementCreator("div", ["class", "f-sort", "f-sort-earliest"], false, par);
    elementCreator("p", false, "Sort by: ", sortDiv);
    const arrTextDiv = elementCreator("div", false,false, sortDiv);
    const sortArrow = elementCreator("span", ["class", "f-sort-arrow"], "↓", arrTextDiv);
    const sortText = elementCreator("span", ["class", "f-sort-text"], "Earliest", arrTextDiv);
    sortDiv.addEventListener("click", sortFunc);

    return sortDiv;

    function sortFunc(){
        if(this.className.includes("f-sort-earliest")){
            this.classList.remove("f-sort-earliest");
            this.classList.add("f-sort-latest");
            sortArrow.innerText = "↑";
            sortText.innerText = "Latest";
            settingsObj.sort=true;
        }
        else{
            this.classList.add("f-sort-earliest")
            this.classList.remove("f-sort-latest")
            sortArrow.classList.remove("f-sort-arr-up")
            sortArrow.innerText = "↓";
            sortText.innerText = "Earliest";
            settingsObj.sort=false;
        }
        createTaskDisplay();
    }
}

// menu effect stuff
function optionsBtnEffect(lineDiv){
    const btn = lineDiv.parentElement
    const lineArr = lineDiv.childNodes;
    const cList = ["op-line-0-show", "op-line-1-show", "op-line-2-show"];
    btn.addEventListener("click", eff);
    function eff(){
    const settingsDiv = lineDiv.parentElement.nextSibling;
        if(!btn.className.includes("to-menu-on")){
            btn.classList.add("to-menu-on");
            triggerEffect(true);
            settingsDiv.classList.remove("f-settings-hidden")
            setTimeout(()=>{settingsDiv.style.display="grid"}, 170)

        }
        else{
            btn.classList.remove("to-menu-on");
            triggerEffect(false);
            settingsDiv.classList.add("f-settings-hidden")
            setTimeout(()=>{settingsDiv.style.display="none"}, 170)


        }
    }
    function triggerEffect(isAdd){
        for(let i=0;i<3;i++){
            isAdd?lineArr[i].classList.add(cList[i]):lineArr[i].classList.remove(cList[i]);
        }
    }
}