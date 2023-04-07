import { elementCreator, imageCreator } from '../utilities/elementCreator';
import googleLogo from '/src/assets/images/google-logo.png';
import { createInfoBox } from '../utilities/infoBox/infoBox';
import { createMainPageDom } from '../mainPage/mainPage';
import { isLoggedModify } from '../state';
import { signInWithGoogle } from '../firebase';
import "/src/loginPage/login.css"
export function createLoginPageDom(){
    document.body.classList.add("body-login");
    const title = elementCreator("h1", ["class", "main-title-login"], "Todoer", document.body)
    const mainLoginDiv = elementCreator("div", ["class", "login-main-div"], false, document.body);
    const loginBtns = elementCreator("div", ["class", "login-btn-div"], false, mainLoginDiv);
    const googleBtn = makeGoogleLogo(loginBtns);
    const localBtn = makeLocalBtn(loginBtns);

    googleBtn.addEventListener("click", googleClick);
    localBtn.addEventListener("click", localClick)


}
function googleClick(){
    // createHomeFromLogin(true) in firebase.js authentication part
    signInWithGoogle();
};
function localClick(e){
    if(e.target.closest(".info-box")){return;}
    createHomeFromLogin(false)
};

export function createHomeFromLogin(isLogged){
    document.body.classList.remove("body-login");
    isLoggedModify(isLogged);
    const loginMainDiv = document.querySelector(".login-main-div");
    loginMainDiv.remove();
    createMainPageDom()

}


function makeGoogleLogo(parent){
    const googleDiv = elementCreator("div", ["class", "google-div"], false, parent);
    const logoDiv = elementCreator("div", false, false,googleDiv);
    imageCreator(googleLogo, false, logoDiv);
    elementCreator("p", false, "Sign in with Google", googleDiv);
    return googleDiv;
}

function makeLocalBtn(parent){
    const btnDiv = elementCreator("div", ["class", "login-local-div"], false, parent);
    elementCreator("p", false, "Sign in as guest", btnDiv);
    const hoverText = "Data saved in your browser's local storage"
    btnDiv.appendChild(createInfoBox(hoverText));
    return btnDiv;
}

