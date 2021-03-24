// Selectors
const body = document.querySelector("body");
const todoInput = document.querySelector(".input");
const todoInputLabel = document.querySelector(".todo-input-label");
const todoList = document.querySelector(".todo-list");
const todoMenu = document.querySelector(".todo-menu");
const todoMenuAfter = document.querySelector(".todo-menu-after");
const todoItemLeft = document.querySelector(".todo-count");

const menuAll = document.querySelector(".all");
const menuActive = document.querySelector(".active");
const menuComplite = document.querySelector(".complite");
const clearComplited = document.querySelector(".clear-complited");

var countItem = 0;
var complitedItem = 0;

var todos;
var item;
var complited;
function toLocal() {
    todos = todoList.innerHTML;
    item = countItem;
    complited = complitedItem;
    localStorage.setItem('todos', todos);
    localStorage.setItem('item', item);
    localStorage.setItem('complited', complited);
}

function toLocalFilter() {
    localStorage.setItem('all', menuAll.classList.contains("selected"));
    localStorage.setItem('active', menuActive.classList.contains("selected"));
    localStorage.setItem('complite', menuComplite.classList.contains("selected"));
}

if (localStorage.getItem('todos')) {
    todoList.innerHTML = localStorage.getItem('todos');
    countItem = parseInt(localStorage.getItem('item'));
    complitedItem = parseInt(localStorage.getItem('complited'));

    if (todoList.childNodes.length > 3) {
        todoMenu.classList.remove("hidden");
        todoInputLabel.classList.remove("hidden");
        todoMenuAfter.classList.remove("hidden");
    }

    todoItemLeft.innerHTML = (countItem) + " items left";

    if (complitedItem > 0) {
        clearComplited.classList.remove("hidden");
    }

    //filters
    if (localStorage.getItem('all') == "true") {
        menuAll.classList.add("selected");
        menuActive.classList.remove("selected");
        menuComplite.classList.remove("selected");
    }
    if (localStorage.getItem('active') == "true") {
        menuAll.classList.remove("selected");
        menuActive.classList.add("selected");
        menuComplite.classList.remove("selected");
    }
    if (localStorage.getItem('complite') == "true") {
        menuAll.classList.remove("selected");
        menuActive.classList.remove("selected");
        menuComplite.classList.add("selected");
    }
}

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
    if ((event.keyCode == 13) && (todoInput.value.trim())){
        if (todoInput.value == "") {
            event.preventDefault();
            return false;
        }
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
        todoInputLabel.classList.remove("hidden");
        todoMenuAfter.classList.remove("hidden");
        countItem += 1;
        todoItemLeft.innerHTML = (countItem) + " items left";

        if (menuComplite.classList.contains("selected")) {
            newTodo.classList.add("hidden");
        }

        toLocal();
    }
}

function compliteTodo(event) {
    const labelClose = event.target;
    labelClose.classList.toggle("all-complited");
    const todos = todoList.childNodes;
    if (labelClose.classList.contains("all-complited")) {
        for (i = 3; i < todos.length; ++i) {
            todos[i].classList.add("complited");
        }
        if (menuActive.classList.contains("selected")) {
            for (i = 3; i < todos.length; ++i) {
                todos[i].style.display = "none";
            }
        }
        if (menuComplite.classList.contains("selected")) {
            for (i = 3; i < todos.length; ++i) {
                todos[i].style.display = "flex";
            }
        }
        countItem = 0;
        todoItemLeft.innerText = (countItem) + " items left";
        complitedItem = todoList.childNodes.length - 3;
    }
    else {
        for (i = 3; i < todos.length; ++i){
            todos[i].classList.remove("complited");
        }
        if (menuActive.classList.contains("selected")) {
            for (i = 3; i < todos.length; ++i) {
                todos[i].style.display = "flex";
            }
        }
        if (menuComplite.classList.contains("selected")) {
            for (i = 3; i < todos.length; ++i) {
                todos[i].style.display = "none";
            }
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

    toLocal();
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
    }
    if (item.classList[0] === "complited-button") {
        todo.classList.toggle("complited");

        //items left
        if (todo.classList.contains("complited")){
            countItem -= 1;
            complitedItem += 1;
        }
        else {
            countItem += 1;
            complitedItem -= 1;
        }

        if (menuActive.classList.contains("selected")) {
            todo.style.display = "none";
        }
    } 
    todoItemLeft.innerHTML = (countItem) + " items left";

    //clear complited
    if (complitedItem < 1) {
        clearComplited.classList.add("hidden");
    }
    else {
        clearComplited.classList.remove("hidden");
    }

    if (todoList.childNodes.length < 4) {
        countItem = 0;
        complitedItem = 0;
        todoMenu.classList.add("hidden");
        todoInputLabel.classList.add("hidden");
        todoMenuAfter.classList.add("hidden");
    }

    toLocal();
}

function filterTodo(event) {
    const menu = event.target;
    const todos = todoList.childNodes;
    for (i = todos.length - 1; i > 2; --i) {
        switch (menu.classList[0]) {
            case "all":
                menuAll.classList.add("selected");
                menuActive.classList.remove("selected");
                menuComplite.classList.remove("selected");
                todos[i].style.display = "flex";
                break;
            case "active":
                menuAll.classList.remove("selected");
                menuActive.classList.add("selected");
                menuComplite.classList.remove("selected");
                if (todos[i].classList.contains("complited")) {
                    todos[i].style.display = "none";
                }
                else {
                    todos[i].style.display = "flex";
                }
                break;
            case "complite":
                menuAll.classList.remove("selected");
                menuActive.classList.remove("selected");
                menuComplite.classList.add("selected");
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
                
                if (todoList.childNodes.length < 4) {
                    todoMenu.classList.add("hidden");
                    todoInputLabel.classList.add("hidden");
                    todoMenuAfter.classList.add("hidden");
                }
                break;   
        }
    }
    toLocal();
    toLocalFilter();
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

    toLocal();
}

function saveTodoText(event) {
    if ((event.keyCode == 13) || (event.keyCode == 27)){
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

    toLocal();
}