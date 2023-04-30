import { CreateMainCal } from '../../calendar/mainCal';
import { elementCreator } from '../../utilities/elementCreator';
import { followMouseHoverText } from '../../utilities/hoverDiv';
import '/src/Header/headerCal/headerCal.css'

export function headerCalFunc(calBtn){
    calBtn.addEventListener("click", generateHeadCal);

}

function generateHeadCal(e){

    if(document.querySelector(".header-cal-main")!==null) return;
    const mainCalDiv = elementCreator("div", ["class", "header-cal-main"], false, document.body);
    const titleBar = createTitleBar(mainCalDiv);
    const calDiv = elementCreator("div", ["class", "header-cal-div"], false, mainCalDiv);

    const cal = CreateMainCal("headerCal",mainCalDiv, true, false);

    calDiv.appendChild(cal)

}

























// title bar
function createTitleBar(parent){
    const titleBar = elementCreator("div",["class", "header-cal-title-bar"], false, parent);
    const detachBtn = createDetach();
    const closeBtn = elementCreator("div", ["class", "h-close-btn"], "X", titleBar)
    closeBtn.addEventListener("click", ()=>{
        console.log(parent);
        parent.remove()}
        )
    return titleBar;

    function createDetach(){
        const detachDiv = elementCreator("div", ["class", "h-detach-div"], false, titleBar);
        const innerDiv = elementCreator("div", false, false, detachDiv);
        const lowerSquare = elementCreator("div", ["class", "h-detach-lower"],false, innerDiv);
        const upperSquare = elementCreator("div", ["class", "h-detach-upper"], false, innerDiv)
        upperSquare.innerHTML ='&#8599';

        followMouseHoverText(detachDiv, "detach/reattach window")
        detachDiv.addEventListener("click", detachFunc)
        return detachDiv;

        function detachFunc(){
            if(!parent.className.includes("header-cal-detached")){
                parent.classList.add("header-move-anim");
                setTimeout(()=>parent.classList.remove("header-move-anim"), 150)
                parent.classList.add("header-cal-detached");
                titleBar.classList.add("header-title-detached")
                upperSquare.style.transform = 'rotate(180deg)';
                parent.style.right = "20px";

                makeDragFunc(parent, titleBar)
                parent.style.top = "70px";
            }
            else{
                parent.classList.add("header-move-anim");
                setTimeout(()=>parent.classList.remove("header-move-anim"), 150)
                parent.classList.remove("header-cal-detached")
                titleBar.classList.remove("header-title-detached")
                upperSquare.style.transform = 'rotate(0deg)';
                disableDragging(parent, titleBar)

            }
        }
    }
}

function disableDragging(draggableDiv, handleDiv) {
    handleDiv.onmousedown = null;
    draggableDiv.style.right="0px"
    draggableDiv.style.left="auto"
    draggableDiv.style.top="50px";
  }
function makeDragFunc(draggableDiv, handleDiv) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handleDiv.onmousedown = dragMouseDown;
  
    function dragMouseDown(e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      let newTop = draggableDiv.offsetTop - pos2;
      let newLeft = draggableDiv.offsetLeft - pos1;
      let maxTop = window.innerHeight - draggableDiv.offsetHeight;
      let maxLeft = window.innerWidth - draggableDiv.offsetWidth;
      let headerHeight = 50;
      if(newTop < headerHeight){
        newTop =headerHeight;
      } 
      else if(newTop> maxTop){
    newTop = maxTop;
      }
      if (newLeft < 0){
        newLeft = 0;
      } 
      else if (newLeft > maxLeft){
        newLeft = maxLeft;
      }
      draggableDiv.style.top = newTop + "px";
      draggableDiv.style.left = newLeft+ "px";
    }
  
    function closeDragElement(){
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }