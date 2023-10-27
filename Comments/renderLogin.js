import { login, setToken, token} from "./API.js";


export const renderLogin = ({ getCommentation }) => {
    const appElement = document.getElementById("app");
    const loginHtml = `
    <div class="container">
     <div class="login-form">
       <p class="login-text">Форма входа</p>
         <input type="text" class="input" id="login-input" placeholder="Введите ваш логин"/>
         <input type="password" class="input" id="password-input" placeholder="Введите ваш пароль"/>
        <button class="login-button" disabled>Войти</button>
      
      <a href="#" class="register">Зарегистрироваться</a>
       </div>
            </div>
     `;
 
     appElement.innerHTML = loginHtml;
 
     const buttonElement = document.getElementById("login-button");
 const loginInputElement = document.getElementById("login-input");
 const passwordInputElement = document.getElementById("password-input");
 
 buttonElement.addEventListener("click", () => {
     login({
         login: loginInputElement.value,
         password: passwordInputElement.value,
     }).then((responseData) => {
     
         console.log(token);
        setToken(responseData.user.token)
         console.log(token);
     })
     .then(() => {
         getCommentation();
     })
 });
 };
