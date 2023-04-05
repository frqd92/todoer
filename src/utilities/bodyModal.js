import { elementCreator } from "./elementCreator";
import '/src/taskModal/addModal.css'
export function createBodyModal(div){
    const bgDiv = elementCreator("div", ["class", "bg-div-modal"], false, document.body, true);
    bgDiv.addEventListener("click", closeDiv, {once:true});
   


    setTimeout(()=>{
        div.classList.add("bg-div-show");
        bgDiv.classList.add("bg-div-show");
    }, 100);

    function closeDiv(){
    // insert logic that saves unsaved content
    div.classList.remove("bg-div-show");
    bgDiv.classList.remove("bg-div-show");
    setTimeout(()=>{
        div.remove();
        bgDiv.remove();
    }, 100)

    }
}