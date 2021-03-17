// Selectors
const body = document.querySelector("body");
const todoInput = document.querySelector(".input");
const todoInputLabel = document.querySelector(".todo-input-label");
const todoList = document.querySelector(".todo-list");
const todoMenu = document.querySelector(".todo-menu");
const todoItemLeft = document.querySelector(".todo-count");

const menuAll = document.querySelector(".all");
const menuActive = document.querySelector(".active");
const menuComplited = document.querySelector(".complited");
const clearComplited = document.querySelector(".clear-complited");

var countItem = 0;
var complitedItem = 0;

//Events
todoInput.addEventListener("keydown", addToDo);
todoInputLabel.addEventListener("click", compliteTodo);
todoList.addEventListener("click", editTodo);
todoList.addEventListener("dblclick", editTodoText);
todoList.addEventListener("keydown", saveTodoText);
todoMenu.addEventListener("click", filterTodo);
body.addEventListener("click", saveTodoText)

//Functions
function addToDo(event) {
    if ((event.keyCode == 13) && (todoInput.value != "")){
        event.preventDefault();

        //list item
        const newTodo = document.createElement("li");
        newTodo.classList.add("todo");

        const newTodoWrapper = document.createElement("div");
        newTodoWrapper.classList.add("todo-wrapper");
    
        //complited button
        const complitedButton = document.createElement("div");
        complitedButton.classList.add("complited-button");
        newTodoWrapper.appendChild(complitedButton);

        //item text
        const todoText = document.createElement("label");
        todoText.classList.add("todo-text");
        todoText.innerText = todoInput.value;
        newTodoWrapper.appendChild(todoText);

        //trashed button
        const trashedButton = document.createElement("div");
        trashedButton.classList.add("trashed-button");
        trashedButton.innerText = '×';
        newTodoWrapper.appendChild(trashedButton);

        newTodo.appendChild(newTodoWrapper);
        todoList.appendChild(newTodo);
        todoInput.value = "";
        todoMenu.classList.remove("hidden");
        countItem += 1;
        todoItemLeft.innerText = (countItem) + " items left";
    }
}

function compliteTodo(event) {
    const labelClose = event.target;
    labelClose.classList.toggle("close");
    const todos = todoList.childNodes;
    if (labelClose.classList.contains("close")) {
        for (i = 3; i < todos.length; ++i) {
            todos[i].classList.add("complited");
        }
        countItem = 0;
        todoItemLeft.innerText = (countItem) + " items left";
        complitedItem = todoList.childNodes.length - 3;
    }
    else {
        for (i = 3; i < todos.length; ++i){
            todos[i].classList.remove("complited");
        }
        countItem = todoList.childNodes.length - 3;
        todoItemLeft.innerText = (countItem) + " items left";
        complitedItem = 0;
    }

    //clear complited
    if (complitedItem < 1) {
        clearComplited.classList.add("hidden");
    }
    else {
        clearComplited.classList.remove("hidden");
    }
}

function editTodo(event) {
    const item = event.target;
    const todoWrapper = item.parentElement;
    const todo = todoWrapper.parentElement;
    if (item.classList[0] === "trashed-button") {
        todo.remove();
        if (!(todo.classList.contains("complited"))){
            countItem -= 1;
        }
        else {
            complitedItem -= 1;
        }
        todoItemLeft.innerText = (countItem) + " items left";
    }
    if (item.classList[0] === "complited-button") {
        todo.classList.toggle("complited");

        //items left
        if (todo.classList.contains("complited")){
            countItem -= 1;
            todoItemLeft.innerText = (countItem) + " items left";
            complitedItem += 1;
        }
        else {
            countItem += 1;
            todoItemLeft.innerText = (countItem) + " items left";
            complitedItem -= 1;
        }
    } 
    //clear complited
    if (complitedItem < 1) {
        clearComplited.classList.add("hidden");
    }
    else {
        clearComplited.classList.remove("hidden");
    }

    if (todoList.childNodes.length < 4) {
        todoMenu.classList.add("hidden");
    }
}

function filterTodo(event) {
    const menu = event.target;
    const todos = todoList.childNodes;
    for (i = todos.length - 1; i > 2; --i) {
        switch (menu.classList[0]) {
            case "all":
                menuAll.classList.add("selected");
                menuActive.classList.remove("selected");
                menuComplited.classList.remove("selected");
                todos[i].style.display = "flex";
                break;
            case "active":
                menuAll.classList.remove("selected");
                menuActive.classList.add("selected");
                menuComplited.classList.remove("selected");
                if (todos[i].classList.contains("complited")) {
                    todos[i].style.display = "none";
                }
                else {
                    todos[i].style.display = "flex";
                }
                break;
            case "complited":
                menuAll.classList.remove("selected");
                menuActive.classList.remove("selected");
                menuComplited.classList.add("selected");
                if (todos[i].classList.contains("complited")) {
                    todos[i].style.display = "flex";
                }
                else {
                    todos[i].style.display = "none";
                }
                break; 
            case "clear-complited":
                if (todos[i].classList.contains("complited")) {
                    todos[i].remove();
                }
                complitedItem = 0;
                clearComplited.classList.add("hidden");
                break;   
        }
    }
}

function editTodoText(event) {
    const editText = event.target;
    const todoWrapper = editText.parentElement; 
    todoWrapper.classList.add("hidden");
    const todo = todoWrapper.parentElement;
    todo.classList.add("editing");

    const todoInput = document.createElement("input");
    todoInput.classList.add("todo-input");
    todoInput.value = editText.innerText;
    todo.appendChild(todoInput);

    todoInput.focus();
}

function saveTodoText(event) {
    if ((event.keyCode == 13)){
        event.preventDefault();

        const editText = event.target;
        const todo = editText.parentElement;
        todo.classList.remove("editing");
        const todoWrapper = todo.childNodes[0];
        const todoWrapperChild = todoWrapper.childNodes;
        var todoWrapperText;
        for (i = 0; i < todoWrapperChild.length; ++i){
            if (todoWrapperChild[i].classList.contains("todo-text")) {
                todoWrapperText = todoWrapperChild[i];
            }
        }
        todoWrapperText.innerText = editText.value;

        todoWrapper.classList.remove("hidden");
        editText.remove();
    }

    if (!(event.target.classList.contains("todo-input")) && (typeof todoList !== 'undefined')) {
        const todoListChild = todoList.childNodes;
        for (let i = 3; i < todoListChild.length; i++) {
            if (todoListChild[i].classList.contains("editing")) {
                const todo = todoListChild[i];
                todo.classList.remove("editing");
                const todoWrapper = todo.childNodes[0];
                const editText = todo.childNodes[1];
                const todoWrapperChild = todoWrapper.childNodes;
                var todoWrapperText;
                for (i = 0; i < todoWrapperChild.length; ++i){
                    if (todoWrapperChild[i].classList.contains("todo-text")) {
                        todoWrapperText = todoWrapperChild[i];
                    }
                }
                todoWrapperText.innerText = editText.value;

                todoWrapper.classList.remove("hidden");
                editText.remove();
            }     
        }
    }
}