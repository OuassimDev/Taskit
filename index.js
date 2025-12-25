let taskcontainer = document.getElementById("taskcontainer");
let input = document.getElementById("listinput");
let inputbtn = document.getElementById("input-btn");
let tempmsg = document.getElementById("tempmsg");
function addtask () {
    if (input.value.trim() === "") return alert("Empty Input");


    const task = document.createElement("div");
    task.className = "task";


    const text = document.createElement("p");
    text.textContent = input.value;


    const btns = document.createElement("div");
    btns.className = "task-btns";

    const doneBtn = document.createElement("button");
    doneBtn.textContent = "Done";
    doneBtn.addEventListener("click", () => {
        text.style.textDecoration="line-through";
        task.style.backgroundColor="#C5D89D";
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Del";
    delBtn.addEventListener("click", () => {
        task.remove();
    });


    btns.append(doneBtn, delBtn);
    task.append(text, btns);
    taskcontainer.prepend(task);

    input.value = "";
    tempmsg.style.display="none";
}

inputbtn.addEventListener("click", () => {
    addtask();
});
input.addEventListener("keypress", (e) => {
    if(e.key === "Enter") addtask();
});


let showmenu = document.getElementById("add-btn");
let menu = document.getElementById("addmenu");
menu.style.display="none";
showmenu.addEventListener("click",()=>{
    if(menu.style.display==="none"){
        menu.style.display="flex";
        showmenu.style.rotate="135deg";
    }
    else{
        menu.style.display="none";
        showmenu.style.rotate="0deg";
    }
});


// pain ;/ :
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
    

    tasks.reverse().forEach(taskData => {
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
        
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.addEventListener("click", () => {
            text.style.textDecoration = "line-through";
            task.style.backgroundColor = "#C5D89D";
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
        
        btns.append(doneBtn, delBtn);
        task.append(text, btns);
        taskcontainer.appendChild(task);
    });
}


const originalAddTask = addtask;
window.addtask = function() {
    originalAddTask();
    saveTasks();
};


document.addEventListener('click', (e) => {
    if (e.target.matches('.task-btns button')) {
        setTimeout(saveTasks, 10);
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadTasks);
} else {
    loadTasks(); 
}