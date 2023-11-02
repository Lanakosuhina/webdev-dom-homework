import { likeComment, answerCommentListener, editComment } from "./additional.js";
import { nameInput, commentInput, addButton, addLoader } from "./const.js";
import { appElement } from "./const.js";
import { token } from "./API.js";
import { renderLogin } from "./renderLogin.js";

export function renderComments({ comments, user }) {
  let commentSection = document.querySelector(".comments");

  const commentsHtml = comments
    .map((comment, index) => {
      return `<li class="comment" id="comment" data-index="${index}">
  <div class="comment-header">
    <div>${comment.name}</div>
    <div>${comment.date}</div>
  </div>
  <div class="comment-body" data-index="${index}">
    ${comment.isEdited ? `<textarea id="textarea-${index}">${comment.text}</textarea>` : `<div class="comment-text">${comment.text}</div>`}
  </div>
  <div class="comment-footer">
    <button class="edit-button">${comment.isEdited ? 'Сохранить' : 'Редактировать'}</button>
    <div class="likes">
      <span class="likes-counter">${comment.likesCount}</span>
      <button class="like-button ${comment.isLiked ? '-active-like' : ''} ${comment.isLikeLoading ? '-loading-like' : ''}"></button>
    </div>
  </div>
</li>`;
    })
    .join('');
  
    
 

  // если юзер авторизован нужно менять поле с авторизацией на поле с комментариями
  const appHtml =  
  `<div class="container">
    <div class="mask">
      <p class="loader">Пожалуйста подождите, комментарии загружаются...</p>
      <div class="comments-loading"></div>
    </div>  

    <ul id="comments" class="comments">
      ${commentsHtml}
    </ul>
    ${token ? `<div class="add-form">
    <input type="text" class="add-form-name" placeholder="${user.name}" readonly/>
    <textarea type="textarea" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
    <div class="add-form-row">
      <button class="add-form-button" disabled>Написать</button>
    </div>
  </div>
  <button class="delete-form-button">Удалить последний комментарий</button> 
  </div>` : `<p>Чтобы добавить комментарий, <a id="link-to-login" href="#"> авторизуйтесь</a></p>`}  
  `;
    
  appElement.innerHTML = appHtml;


// addLoader.style.display = 'block';
  // document.body.style.overflow = 'hidden';
  
  likeComment(comments);
  answerCommentListener(comments);
  editComment(comments);

  
  const linkToLoginElement = document.getElementById("link-to-login"); 

  linkToLoginElement?.addEventListener("click", () => {  // null или undef. обработчик события не сработает
    renderLogin();

  })      

  nameInput.addEventListener('input', () => {
    turnOnOff();
  });

  commentInput.addEventListener('input', () => {
    turnOnOff();
  });

  function turnOnOff() {
    let username = nameInput.value;
    let comment = commentInput.value;

    if (username && comment) {
      document.querySelector(".add-form-button").disabled = false;
    } else {
      document.querySelector(".add-form-button").disabled = true;
    }
  }
   //  ОТПРАВЛЕНИЕ ПО КЛИКУ И ПРИ НАЖАТИИ НА ENTER

   addButton.addEventListener("click", () => {
    renderComments({ comments });
  });

  addButton.addEventListener('keyup', function (event) {
    if (event.which === 13) {
      renderComments({ comments });
    }
  });

  addButton.addEventListener("click", (event) => {
    if (nameInput.value === "" && commentInput.value === "") {
      nameInput.classList.add("error");
      commentInput.classList.add("error");
      return;
    }
    addButton.disabled = true;
    addButton.textContent = 'Комментарий добавляется...';

    event.stopPropagation();
    commentPost()
      .then((responseData) => {
        return [nameInput.value, commentInput.value]
      })
      .then(() => {
        addButton.disabled = false;
        addButton.textContent = 'Написать'
      })
      .then(() => {
        nameInput.value = "";
        commentInput.value = "";
      })
      .then(() => {
        getCommentation();
      })
      .catch((error) => {
        console.warn(error);
        if (error.message === "Сервер сломался") {
          alert("Сервер сломался, попробуй перезагрузить страницу позже");
          addForm.style.display = 'none';
          addButton.disabled = true;
          return;
        } else if (error.message === "Плохой запрос") {
          alert("В поле должны содержаться хотя бы 3 символа");
          nameInput.classList.add("error");
          commentInput.classList.add("error");
          setTimeout(() => {
            nameInput.classList.remove("error");
            commentInput.classList.remove("error");
          }, 2000);
          return;
        }
        alert("Кажется, у вас сломался интернет, попробуйте позже");
      })
      .finally(() => {
        addForm.style.display = 'blok';
        addButton.disabled = false;
        addButton.textContent = 'Написать'
      })

    renderComments({ comments });

  });


  //  ОТПРАВЛЕНИЕ ПО КЛИКУ И ПРИ НАЖАТИИ НА ENTER (только пока не понятно чего)



  addButton.addEventListener("click", () => {

  });

  addButton.addEventListener('keyup', function (event) {
    if (event.which === 13) {

    }
  });

 renderComments({ comments });
}