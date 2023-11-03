// Модуль main.js
import { getTodos } from "./api.js";
import { renderLogin } from "./RenderLogin.js";
import { renderTasks } from "./renderTasks.js";

let tasks = [];

const fetchAndRenderTasks = () => {
  getTodos().then((responseData) => {
    tasks = responseData.todos;
    renderTasks({ tasks, fetchAndRenderTasks });
    return true;
  });
};

// fetchAndRenderTasks();
renderLogin({ fetchAndRenderTasks });
// отсюда начинается работа приложения, отрисовывается страница входа,
//  при нажатии на кнопку войти - отрисовываем страницу с задачами
