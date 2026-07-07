let taskcontainer = document.getElementById("taskcontainer");
let input = document.getElementById("listinput");
let inputbtn = document.getElementById("input-btn");
let tempmsg = document.getElementById("tempmsg");
let taskCountEl = document.getElementById("task-count");

const authScreen = document.getElementById("auth-screen");
const appNav = document.getElementById("app-nav");
const appMain = document.getElementById("app-main");
const authEmail = document.getElementById("auth-email");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const signInBtn = document.getElementById("auth-signin-btn");
const signUpBtn = document.getElementById("auth-signup-btn");
const signOutBtn = document.getElementById("signout-btn");
let showmenu = document.getElementById("add-btn");
let showmenu2 = document.getElementById("add-btn2");
let menu = document.getElementById("addmenu");

function showApp() {
    authScreen.style.display = "none";
    appNav.style.display = "flex";
    appMain.style.display = "block";
    if (window.innerWidth > 768) {
        showmenu.style.display = "flex";
    }
}

function showAuth() {
    authScreen.style.display = "flex";
    appNav.style.display = "none";
    appMain.style.display = "none";
    showmenu.style.display = "none";
    menu.classList.remove("is-active");
    taskcontainer.innerHTML = "";
}

async function handleSignIn() {
    authError.textContent = "";
    const { error } = await db.auth.signInWithPassword({
        email: authEmail.value.trim(),
        password: authPassword.value
    });
    if (error) authError.textContent = error.message;
}

async function handleSignUp() {
    authError.textContent = "";
    const { error } = await db.auth.signUp({
        email: authEmail.value.trim(),
        password: authPassword.value
    });
    if (error) {
        authError.textContent = error.message;
    } else {
        authError.style.color = "#22c55e";
        authError.textContent = "Account created — check your email if confirmation is required, then sign in.";
    }
}

async function handleSignOut() {
    await db.auth.signOut();
}

signInBtn.addEventListener("click", handleSignIn);
signUpBtn.addEventListener("click", handleSignUp);
signOutBtn.addEventListener("click", handleSignOut);
authPassword.addEventListener("keypress", (e) => { if (e.key === "Enter") handleSignIn(); });

db.auth.onAuthStateChange((event, session) => {
    if (session) {
        showApp();
        loadTasks();
    } else {
        showAuth();
    }
});

function updateCount() {
    const total = document.querySelectorAll('.task').length;
    const done = document.querySelectorAll('.task.is-done').length;
    const left = total - done;
    taskCountEl.textContent = `${left} left`;
}

function createTaskElement(taskData) {
    const task = document.createElement("div");
    task.className = "task" + (taskData.done ? " is-done" : "");
    task.dataset.id = taskData.id;

    const left = document.createElement("div");
    left.className = "task-left";

    const text = document.createElement("p");
    text.className = "task-text";
    text.textContent = taskData.content;

    if (taskData.done) {
        text.style.textDecoration = "line-through";
        text.style.opacity = "0.5";
    }

    const badge = document.createElement("label");
    badge.className = "date-badge";

    const calIcon = document.createElement("span");
    calIcon.className = "cal-icon";
    calIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="13px" viewBox="0 -960 960 960" width="13px"><path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Zm280 240q-17 0-28.5-11.5T440-440q0-17 11.5-28.5T480-480q17 0 28.5 11.5T520-440q0 17-11.5 28.5T480-400Zm-160 0q-17 0-28.5-11.5T280-440q0-17 11.5-28.5T320-480q17 0 28.5 11.5T360-440q0 17-11.5 28.5T320-400Zm320 0q-17 0-28.5-11.5T600-440q0-17 11.5-28.5T640-480q17 0 28.5 11.5T680-440q0 17-11.5 28.5T640-400ZM480-240q-17 0-28.5-11.5T440-280q0-17 11.5-28.5T480-320q17 0 28.5 11.5T520-280q0 17-11.5 28.5T480-240Zm-160 0q-17 0-28.5-11.5T280-280q0-17 11.5-28.5T320-320q17 0 28.5 11.5T360-280q0 17-11.5 28.5T320-240Zm320 0q-17 0-28.5-11.5T600-280q0-17 11.5-28.5T640-320q17 0 28.5 11.5T680-280q0 17-11.5 28.5T640-240Z"/></svg>`;

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.className = "date-input";
    dateInput.value = taskData.date || "";
    dateInput.addEventListener("change", async () => {
        updateBadgeLabel(badge, dateInput.value);
        await updateTask(taskData.id, { date: dateInput.value || null });
    });

    const dateLabel = document.createElement("span");
    dateLabel.className = "date-label";
    dateLabel.textContent = taskData.date ? formatDate(taskData.date) : "Set date";

    badge.append(calIcon, dateLabel, dateInput);
    left.append(text, badge);

    const btns = document.createElement("div");
    btns.className = "task-btns";

    const editBtn = document.createElement("button");
    editBtn.className = "btn-edit";
    editBtn.title = "Edit";
    editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-528q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L289-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>`;
    editBtn.addEventListener("click", async () => {
        const newText = prompt("Edit task:", text.textContent);
        if (newText && newText.trim() !== "") {
            text.textContent = newText.trim();
            await updateTask(taskData.id, { content: newText.trim() });
        }
    });

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn-done";
    doneBtn.title = taskData.done ? "Undo" : "Done";
    doneBtn.innerHTML = taskData.done
        ? `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;

    doneBtn.addEventListener("click", async () => {
        const isDone = task.classList.toggle("is-done");
        text.style.textDecoration = isDone ? "line-through" : "none";
        text.style.opacity = isDone ? "0.5" : "1";
        doneBtn.title = isDone ? "Undo" : "Done";
        doneBtn.innerHTML = isDone
            ? `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"><path d="m424-408-86-86q-11-11-28-11t-28 11q-11 11-11 28t11 28l114 114q12 12 28 12t28-12l226-226q11-11 11-28t-11-28q-11-11-28-11t-28 11L424-408Zm56 328q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
        await updateTask(taskData.id, { done: isDone });
        updateCount();
    });

    const delBtn = document.createElement("button");
    delBtn.className = "btn-del";
    delBtn.title = "Delete";
    delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>`;
    delBtn.addEventListener("click", async () => {
        task.style.animation = "slideOut 0.25s ease forwards";
        await deleteTask(taskData.id);
        setTimeout(() => {
            task.remove();
            updateCount();
            if (taskcontainer.children.length === 0) {
                tempmsg.innerHTML = `Press <strong>+</strong> to add your first task`;
                tempmsg.style.display = "block";
            }
        }, 240);
    });

    btns.append(editBtn, doneBtn, delBtn);
    task.append(left, btns);
    return task;
}

function updateBadgeLabel(badge, value) {
    const label = badge.querySelector('.date-label');
    label.textContent = value ? formatDate(value) : "Set date";
}

function formatDate(value) {
    if (!value) return "Set date";
    const [y, m, d] = value.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${d} ${months[parseInt(m)-1]} ${y}`;
}

async function addtask() {
    if (input.value.trim() === "") return alert("Empty Input");

    const { data, error } = await db
        .from("tasks")
        .insert({ content: input.value.trim(), done: false })
        .select()
        .single();

    if (error) {
        alert("Could not add task: " + error.message);
        return;
    }

    const task = createTaskElement(data);
    task.style.animation = "slideIn 0.3s ease forwards";
    taskcontainer.prepend(task);
    input.value = "";
    tempmsg.style.display = "none";
    updateCount();
}

async function updateTask(id, fields) {
    const { error } = await db.from("tasks").update(fields).eq("id", id);
    if (error) alert("Could not save change: " + error.message);
}

async function deleteTask(id) {
    const { error } = await db.from("tasks").delete().eq("id", id);
    if (error) alert("Could not delete task: " + error.message);
}

async function loadTasks() {
    tempmsg.innerHTML = `Loading your checklist...`;
    tempmsg.style.display = "block";
    taskcontainer.innerHTML = "";

    const { data, error } = await db
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        alert("Could not load tasks: " + error.message);
        return;
    }

    if (!data || data.length === 0) {
        tempmsg.innerHTML = `Press <strong>+</strong> to add your first task`;
        tempmsg.style.display = "block";
        updateCount();
        return;
    }
    tempmsg.style.display = "none";
    data.forEach(taskData => taskcontainer.appendChild(createTaskElement(taskData)));
    updateCount();
}

inputbtn.addEventListener("click", addtask);
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addtask();
});

function toggleMenu() {
    if (!menu.classList.contains("is-active")) {
        menu.classList.add("is-active");
        showmenu.style.rotate = "135deg";
        showmenu2.style.rotate = "135deg";
        setTimeout(() => input.focus(), 100);
    } else {
        menu.classList.remove("is-active");
        showmenu.style.rotate = "0deg";
        showmenu2.style.rotate = "0deg";
    }
}

document.addEventListener('click', (e) => {
    if (
        menu.classList.contains("is-active") &&
        !menu.contains(e.target) &&
        e.target !== showmenu &&
        !showmenu.contains(e.target) &&
        e.target !== showmenu2 &&
        !showmenu2.contains(e.target)
    ) {
        menu.classList.remove("is-active");
        showmenu.style.rotate = "0deg";
        showmenu2.style.rotate = "0deg";
    }
});

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

function showInfo() { document.getElementById('info-popup').style.display = 'block'; }
function hideInfo() { document.getElementById('info-popup').style.display = 'none'; }

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
discord.addEventListener("click", () => { dtext.textContent = "nyxx2429"; });

window.addEventListener("resize", () => {
    if (authScreen.style.display !== "flex") {
        if (window.innerWidth <= 768) {
            showmenu.style.display = "none";
        } else {
            showmenu.style.display = "flex";
        }
    }
});