import { getComments, commentPost } from "./API.js";
import { renderComments } from "./renderComments.js";


"use strict";

let nameInput = document.querySelector(".add-form-name");
let commentInput = document.querySelector(".add-form-text");
let addButton = document.querySelector(".add-form-button");
const deleteButton = document.querySelector(".delete-form-button");
const newComment = document.querySelector(".comment-header");
const current = new Date().toLocaleString();
const likeNumber = document.querySelector(".likes-counter");
const addLoader = document.querySelector(".mask");
const addForm = document.querySelector(".add-form");
let comments = []

addLoader.style.display = 'blok';
document.body.style.overflow = 'hidden';

const getCommentation = () => {
    getComments()
        .then((responseData) => {
            comments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date).toLocaleString('ru-RU', {
                        year: "2-digit", month: "2-digit",
                        day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false
                    }).replace(',', ''),
                    text: comment.text,
                    likesCount: comment.likes,
                    isLiked: false,
                    isEdited: false,
                    isLikeLoading: false
                };
            });
            return comments;
        })
        .then(() => {
            renderComments({ comments });
            addLoader.style.display = 'none';
            document.body.style.overflow = 'visible';
        })
        .catch((error) => {
            console.warn(error);
            if (error.message === "Сервер сломался") {
                alert("Сервер сломался, попробуй позже");
                return;
            }

        })
}

getCommentation();

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
                // addForm.style.display = 'none';
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
            // addForm.style.display = 'blok';
            addButton.disabled = false;
            addButton.textContent = 'Написать'
        })

    renderComments();

});



renderComments();

// ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ ЛАЙКА 


function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

const likeComment = () => {
    const likeButtons = document.querySelectorAll('.like-button'); // находим кнопки лайков 
    likeButtons.forEach((likeButton, index) => {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Чтобы не срабатывали одновременно другие функции 

            const comment = comments[index];
            comment.isLikeLoading = true; // устанавливаем флаг загрузки
            renderComments();
            delay(2000).then(() => { // имитируем задержку загрузки
                if (comment.isLikeLoading) {
                    comment.isLiked = !comment.isLiked; // меняем флаг лайка
                    comment.likesCount = comment.isLiked
                        ? comment.likesCount + 1
                        : comment.likesCount - 1; // изменяем количество лайков
                }
                comment.isLikeLoading = false; // снимаем флаг загрузки
                renderComments(); // перерисовываем комментарии
            });
        });
    })
}

// ФУНКЦИЯ ОТВЕТА НА КОММЕНТАРИЙ И ЕЕ ВЫЗОВ
const answerCommentListener = () => {
    const commentsElement = document.querySelectorAll(".comment");

    for (const commentElement of commentsElement) {
        commentElement.addEventListener("click", () => {
            const index = commentElement.dataset.index;
            if (comments[index].isEdited) return;

            let commentInput = document.querySelector(".add-form-text");
            commentInput.value = `QUOTE_BEGIN ${comments[index].name}: \n ${comments[index].text} QUOTE_END`;
            renderComments();
        })
    }
}

// ФУНКЦИЯ ЗАМЕНЫ СИМВОЛОВ

const sanitizeHtml = (htmlString) => {
    return htmlString
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>")
};


// ФУНКЦИЯ РЕДАКТИРОВАНИЯ КОММЕНТАРИЯ

const editComment = () => {
    const editButtonList = document.querySelectorAll('.edit-button');

    editButtonList.forEach((editButton, index) => {
        editButton.addEventListener('click', (event) => {
            event.stopPropagation();

            const comment = comments[index];
            const newText = document.getElementById(`textarea - ${index}`).value;

            if (comment.isEdited) {
                comment.text = newText;
                comment.isEdited = false;
            } else {
                comment.isEdited = true;
            }

            renderComments();
        });
    });
}




renderComments();

//  ОТПРАВЛЕНИЕ ПО КЛИКУ И ПРИ НАЖАТИИ НА ENTER (только пока не понятно чего)



addButton.addEventListener("click", () => {

});

addButton.addEventListener('keyup', function (event) {
    if (event.which === 13) {

    }
});


// УДАЛЕНИЕ ПОСЛЕДНЕГО КОММЕНТАРИЯ И ОБРАБОТЧИК СОБЫТИЯ
const deleteButtonsListeners = () => {
    deleteButton.addEventListener("click", () => {
        const lastCommentIndex = comments.length - 1;
        comments.splice(lastCommentIndex, 1);

        renderComments();
    });
}

deleteButtonsListeners();


//    const id = deleteButton.dataset.id;


//  ФУНКЦИЯ ОТКЛЮЧЕНИЯ КНОПКИ И ОБРАБОТЧИК СОБЫТИЯ НА INPUTы

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
console.log("It works!");
