import { addButton } from "./const.js";
import { renderComments } from "./renderComments.js";
// ФУНКЦИЯ ЗАМЕНЫ СИМВОЛОВ

export const sanitizeHtml = (htmlString) => {
    return htmlString
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("QUOTE_BEGIN", "<div class='quote'>")
        .replaceAll("QUOTE_END", "</div>")
};

export function delay(interval = 300) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, interval);
    });
}

//  ОТПРАВЛЕНИЕ ПО КЛИКУ И ПРИ НАЖАТИИ НА ENTER (только пока не понятно чего)

addButton.addEventListener("click", () => {
    renderComments({ comments });
});

addButton.addEventListener('keyup', function (event) {
    if (event.which === 13) {
        renderComments({ comments });
    }
});
