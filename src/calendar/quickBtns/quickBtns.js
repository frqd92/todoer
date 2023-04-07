import '/src/calendar/quickBtns/quickBtns.css';
import { chosenDayFunc } from '../../utilities/dateUtils';
import { elementCreator } from '../../utilities/elementCreator';
import { closeMenuOutside } from '../../taskModal/createModal';
export function createQuickBtns(mainCalDiv, outputBtn){
    const dateBtnsDiv = elementCreator("div", ["class", "cal-general-quick-div"], false, false);
    if(document.querySelector(".due-btn-hover-div")===null){
        const hoverDiv = elementCreator("div",["class", "cal-due-btn-hover-div"], false,document.body);
        elementCreator("p", false, false, hoverDiv);
        elementCreator("p", false, false, hoverDiv);
    }

    const btnArray = [
        {none:"None"}, {today:"Today"}, {tomorrow:"Tomorrow"}, 
        {afterTomorrow:"After tomorrow"},{week:"Next week"}, {month:"Next month"}
    ]
    btnArray.forEach((elem)=>{   
        for(const key in elem){
            if (elem.hasOwnProperty(key)) {
                const value = elem[key];
                const btn = elementCreator("div", ["class", "cal-due-btn", `cal-due-btn-${key}`],value, dateBtnsDiv);
                quickAddBtnsFunc(btn, mainCalDiv, outputBtn);
              }
        }
    })
    return dateBtnsDiv;
}

function quickAddBtnsFunc(btn, mainCalDiv, output){
    quickBtnHover(btn);

    btn.addEventListener("click", (e)=>{
        dateToBtn(btn, mainCalDiv, output)
        e.stopPropagation()
    })
}

function dateToBtn(quickBtn, mainCalDiv, output){
    if(!textToDate(quickBtn.innerText)){
        output.innerText = "None";
    }
    else{
        const [date,] = textToDate(quickBtn.innerText);
        output.innerText = date;
    }
    closeMenuOutside(mainCalDiv.parentElement);
}





function textToDate(text){
    if(text==="None") return false;
    const today = new Date();
    const formatDate = new Date(today);
    switch(text){
        case "Tomorrow":
            formatDate.setDate(formatDate.getDate() + 1); break;
        case "After tomorrow":
            formatDate.setDate(formatDate.getDate() + 2); break;
        case "Next week":
            formatDate.setDate(formatDate.getDate()+(((1 + 7 - formatDate.getDay()) % 7)|| 7)); break;
        case "Next month":
            formatDate.setMonth(formatDate.getMonth() + 1 ,1); break;
    }
    const formattedDay = formatDate.getDate()<10?'0'+formatDate.getDate():formatDate.getDate();
    const formattedMonth = (formatDate.getMonth()+1)<10?"0"+(formatDate.getMonth()+1):formatDate.getMonth()+1;
    return [`${formattedDay}/${formattedMonth}/${formatDate.getFullYear()}`, [formatDate.getDate(), formatDate.getMonth()+1, formatDate.getFullYear()]];
}   

function quickBtnHover(btn){
    if(btn.innerText==="None")return;
    const hoverDiv = document.querySelector(".cal-due-btn-hover-div");
    const [dayDiv, dateDiv] =  document.querySelectorAll(".cal-due-btn-hover-div p");
    btn.addEventListener("mouseover", makeVisible, {once:true});


    function makeVisible(){
        const [date, [dd,mm,yy]] = textToDate(btn.innerText);
        let day = chosenDayFunc(yy,Number(mm),dd);
        hoverDiv.style.display="flex";
        dayDiv.innerText = day;
        dateDiv.innerText= date;


        btn.addEventListener("mouseleave", makeInvisible, {once:true});
        btn.addEventListener("mousemove", followMouse);

        function makeInvisible(){
            hoverDiv.style.display="none";
            btn.addEventListener("mouseover", makeVisible, {once:true});
            btn.removeEventListener("mousemove", followMouse);

        }
    
    function followMouse(e){
        hoverDiv.style.top= (e.pageY - 18)+"px";
        hoverDiv.style.left= (e.pageX + 12)+"px";
    }
    }
}