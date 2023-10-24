import { sanitizeHtml } from "./utils.js";
import { nameInput, commentInput } from "./const.js"


export function getComments() {
   
return fetch("https://wedev-api.sky.pro/api/v1/sveta-kosuhina/comments", {
    method: "GET"
  })
    .then((response) => {
      if (response.status === 500) {
        throw new Error("Сервер сломался");
      }
      return response.json()
    })
}

export function commentPost() {
return fetch("https://wedev-api.sky.pro/api/v1/sveta-kosuhina/comments", {
        method: "POST",
        body: JSON.stringify({
            name: sanitizeHtml(nameInput.value),
            text: sanitizeHtml(commentInput.value),
            forceError: false
        })
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error("Плохой запрос");
            } else if (response.status === 500) {
                throw new Error("Сервер сломался");
            }
            if (response.status === 201) {
                return response.json()
            }
        })
    }