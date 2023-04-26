import { elementCreator } from '../utilities/elementCreator'
import '/src/filterOptions/filterOptions.css'

export const settingsObj = {
    sort: false,
    filter: {
        completed: false,
        incomplete: false,
        repeated: false,
        normal: false,
        high: false,
        highest: false
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
    const groupBtn = elementCreator("div", ["class", "f-group-btn"], "Group", mainGroupDiv);
    const menu = elementCreator("div", ["class", "f-group-menu", "f-menu-hidden"], "false", mainGroupDiv);
    settingsMenuFunc(groupBtn, menu)

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
        if(i==2){elementCreator("div", ["class", "f-row-prio-text"],"Priority", menu)}
    }
    settingsMenuFunc(filterBtn, menu)
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
            settingsObj.filter[text]=true;
        }
        else{
            par.classList.add("f-row-checked");
            inner.style.opacity = "1";
            settingsObj.filter[text]=false;
        }
        checkityCheck(this);
        console.log(settingsObj.filter);
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
                    settingsObj.filter.incomplete = false;
                }
                else{
                    inners[0].style.opacity = "1";
                    completed.classList.add("f-row-checked")
                    settingsObj.filter.completed = false;

                }
            }
        }
        if(btn===normal || btn===high || btn===highest){
            const arr = [normal, high, highest];
            let count = 0;
            arr.forEach(elem=>{
                if(!elem.className.includes("f-row-checked")){
                    count++;
                }
            })
            if(count===3){
                normal.classList.add("f-row-checked");
                inners[3].style.opacity = "1";
                settingsObj.filter.normal = false;

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


    return collExpDiv;

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