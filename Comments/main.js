import { getComments, commentPost } from "./API.js";
import { renderComments } from "./renderComments.js";
import { nameInput, commentInput, addButton } from "./const.js"
export let comments = []

const addLoader = document.querySelector(".mask");


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

    renderComments({ comments });

});

renderComments({ comments });



//  ОТПРАВЛЕНИЕ ПО КЛИКУ И ПРИ НАЖАТИИ НА ENTER (только пока не понятно чего)



addButton.addEventListener("click", () => {

});

addButton.addEventListener('keyup', function (event) {
    if (event.which === 13) {

    }
});


console.log("It works!");
