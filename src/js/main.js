const addTodoBtn    = document.querySelector(".todo__btn"),
      removeTodoBtn = document.querySelector(".item__remove"),
      ulElem        = document.querySelector("ul.todo__list"),
      inputTodo     = document.querySelector(".todo__input");


let todoList = getLocalTodos();

if (todoList.length != 0) AddTask();

inputTodo.focus();

addTodoBtn.addEventListener("click", e => {
    if (inputTodo.value != '') {
        todoList.unshift(creaateTask())
        saveLocalTodos(todoList[0]);
        getLocalTodos();
        inputTodo.value = '';
        AddTask();
        inputTodo.focus();
    }
});

inputTodo.addEventListener("keydown", e => {
    if (e.keyCode === 13 && inputTodo.value != '') {
        todoList.unshift(creaateTask())
        saveLocalTodos(todoList[0]);
        getLocalTodos();
        inputTodo.value = '';
        AddTask();
        inputTodo.focus();
    }
});

function AddTask() {
    ulElem.innerHTML = "";

    for (let i = 0; i < todoList.length; i++) {
        const liElem = document.createElement('li');
        liElem.className = "todo__item item";
        ulElem.append(liElem);

        const controlElem = document.createElement('div');
        controlElem.className = "item__control";
        liElem.append(controlElem);

        const doneElem = document.createElement('div');
        doneElem.className = "item__done";
        controlElem.append(doneElem);
        const doneImgElem = document.createElement('img');
        doneImgElem.className = "item__done-img";
        doneImgElem.setAttribute("src", "img/check.svg")
        doneElem.append(doneImgElem);
        doneElem.addEventListener("click", e => {
            todoList[i].done = !todoList[i].done;
            AddTask();
        })

        const removeElem = document.createElement('div');
        removeElem.className = "item__remove";
        controlElem.append(removeElem);
        const removeImgElem = document.createElement('img');
        removeImgElem.className = "item__remove-img";
        removeImgElem.setAttribute("src", "img/trash.svg")
        removeElem.append(removeImgElem);
        removeElem.addEventListener("click", e => {
            removeLocalTodo(todoList[i]);
            todoList.splice(i, 1);
            AddTask();
        });

        const contentElem = document.createElement('div');
        contentElem.className = "item__content";
        liElem.append(contentElem);

        const titleElem = document.createElement('h4');
        titleElem.className = "item__title";
        if (todoList[i].done) titleElem.classList.add("item__title--done");
        titleElem.innerText = todoList[i].title;
        contentElem.append(titleElem);
    }
    updateLocalTodos(todoList);
}

function saveLocalTodos(item) {
    let todos = getLocalTodos();

    todos.unshift(item);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos = [];

    if (localStorage.getItem("todos") != null) {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function removeLocalTodo(item) {
    let todos = getLocalTodos();

    todos.forEach((elem, index, object) => {
        if (elem.id === item.id)
            todos.splice(index, 1)
    });
    localStorage.setItem("todos", JSON.stringify(todos))    
}

function updateLocalTodos(todos) {
    localStorage.setItem("todos", JSON.stringify(todos))    
}

function creaateTask() {
    return {
        id: Date.now(),
        title: inputTodo.value,
        done: false,
    }
}


