let taskcontainer = document.getElementById("taskcontainer");
let input = document.getElementById("listinput");
let inputbtn = document.getElementById("input-btn");
let tempmsg = document.getElementById("tempmsg");

function createTaskElement(taskData) {
    const task = document.createElement("div");
    task.className = "task";

    const text = document.createElement("p");
    text.textContent = taskData.text;
    
    if (taskData.isDone) {
        text.style.textDecoration = "line-through";
        task.style.backgroundColor = "#C5D89D";
    }

    const btns = document.createElement("div");
    btns.className = "task-btns";

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
        const newText = prompt("Edit task:", text.textContent);
        if (newText && newText.trim() !== "") {
            text.textContent = newText.trim();
            saveTasks();
        }
    });

    const doneBtn = document.createElement("button");
    doneBtn.textContent = taskData.isDone ? "Undone" : "Done";
    doneBtn.addEventListener("click", () => {
        if (doneBtn.textContent === "Done") {
            text.style.textDecoration = "line-through";
            task.style.backgroundColor = "#C5D89D";
            doneBtn.textContent = "Undone";
        } else {
            text.style.textDecoration = "none";
            task.style.backgroundColor = "var(--bg-card)";
            doneBtn.textContent = "Done";
        }
        saveTasks();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Del";
    delBtn.addEventListener("click", () => {
        task.remove();
        saveTasks();
        if (taskcontainer.children.length === 0) {
            tempmsg.style.display = "block";
        }
    });

    btns.append(editBtn, doneBtn, delBtn);
    task.append(text, btns);
    return task;
}

function addtask() {
    if (input.value.trim() === "") return alert("Empty Input");

    const task = createTaskElement({ text: input.value, isDone: false });
    taskcontainer.prepend(task);

    input.value = "";
    tempmsg.style.display = "none";
    saveTasks();
}

inputbtn.addEventListener("click", addtask);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addtask();
});

function saveTasks() {
    const tasks = Array.from(document.querySelectorAll('.task')).map(task => {
        return {
            text: task.querySelector('p').textContent,
            isDone: task.querySelector('p').style.textDecoration === 'line-through'
        };
    });
    localStorage.setItem('taskit-tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('taskit-tasks');
    if (!saved) return;
    
    const tasks = JSON.parse(saved);
    if (tasks.length === 0) return;

    tempmsg.style.display = 'none';
    taskcontainer.innerHTML = '';

    tasks.forEach(taskData => {
        taskcontainer.appendChild(createTaskElement(taskData));
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTasks);
} else {
    loadTasks();
}

let showmenu = document.getElementById("add-btn");
let showmenu2 = document.getElementById("add-btn2");
let menu = document.getElementById("addmenu");
menu.style.display = "none";

function toggleMenu() {
    if (menu.style.display === "none") {
        menu.style.display = "flex";
        showmenu.style.rotate = "135deg";
        showmenu2.style.rotate = "135deg";
    } else {
        menu.style.display = "none";
        showmenu.style.rotate = "0deg";
        showmenu2.style.rotate = "0deg";
    }
}

showmenu.addEventListener("click", toggleMenu);
showmenu2.addEventListener("click", toggleMenu);

let darkmode = document.getElementById("dark-mode");
let lightmode = document.getElementById("light-mode");
const html = document.documentElement;

if (localStorage.getItem('theme') === 'dark') {
    html.classList.add('dark-mode');
    darkmode.style.display = "none";
    lightmode.style.display = "flex";
}

darkmode.addEventListener("click", () => {
    html.classList.add('dark-mode');
    darkmode.style.display = "none";
    lightmode.style.display = "flex";
    localStorage.setItem('theme', 'dark');
});

lightmode.addEventListener("click", () => {
    html.classList.remove('dark-mode');
    darkmode.style.display = "flex";
    lightmode.style.display = "none";
    localStorage.setItem('theme', 'light');
});

let infobtn = document.getElementById("info");

function showInfo() {
    document.getElementById('info-popup').style.display = 'block';
}

function hideInfo() {
    document.getElementById('info-popup').style.display = 'none';
}

infobtn.addEventListener("click", showInfo);

document.addEventListener('click', (e) => {
    const popup = document.getElementById('info-popup');
    if (popup.style.display === 'block' && 
        !popup.contains(e.target) && 
        e.target !== infobtn &&
        !infobtn.contains(e.target)) {
        hideInfo();
    }
});

let discord = document.getElementById("Discord-switch");
let dtext = document.getElementById("Text-switch");
discord.addEventListener("click", () => {
    dtext.textContent = "nyxx2429";
});