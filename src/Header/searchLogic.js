export function searchLoupe(btn, input){
    btn.addEventListener("click", ()=>{input.focus()})
}


export function inputBehaviour(input){
    input.addEventListener("keydown", (e)=>{
        if(e.key==="Delete"){
            input.value="";
        }
        else if(e.key==="Escape"){
            input.value="";
            inputClose();
            focusOut();
        }

    })
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
    }
}