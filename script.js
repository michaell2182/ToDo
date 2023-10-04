const inputBox = document.getElementById(i="input-box")
const listContainer = document.getElementById(i="list-container")
function addTask(){
    if(inputBox.valie ==''){
        alert("You must write something");
    }
    else{
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);
        li.draggable = true;
        li.setAttribute("draggable", "true");
        li.setAttribute("ondragstart", "drag(event)");
        li.setAttribute("data-position", listContainer.children.length);
        
   
    }
    inputBox.value = "";
    saveDate();
}
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveDate();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveDate();
    }
}, false);
function saveDate()
{
    localStorage.setItem("data",listContainer.innerHTML);
}
function showTask(){
    listContainer.innerHTML = localStorage.getItem("data");
}
showTask();

function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.dataset.position);
}

function allowDrop(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const fromPosition = event.dataTransfer.getData("text/plain");
    const toPosition = event.target.dataset.position;
    
    // Rearrange the tasks in the list
    if (fromPosition < toPosition) {
        for (let i = fromPosition; i < toPosition; i++) {
            listContainer.children[i].dataset.position = i + 1;
            listContainer.children[i].querySelector("span").setAttribute("onclick", `removeTask(${i + 1})`);
        }
    } else {
        for (let i = fromPosition; i > toPosition; i--) {
            listContainer.children[i - 2].dataset.position = i - 1;
            listContainer.children[i - 2].querySelector("span").setAttribute("onclick", `removeTask(${i - 1})`);
        }
    }

    listContainer.children[fromPosition - 1].dataset.position = toPosition;
    listContainer.children[fromPosition - 1].querySelector("span").setAttribute("onclick", `removeTask(${toPosition})`);

    // Reorder the elements in the DOM
    const movedElement = listContainer.children[fromPosition - 1];
    listContainer.removeChild(movedElement);
    if (toPosition === "1") {
        listContainer.insertBefore(movedElement, listContainer.firstChild);
    } else {
        listContainer.insertBefore(movedElement, listContainer.children[toPosition - 1]);
    }
}
function removeTask(position) {

    listContainer.children[position - 1].remove();
}
document.addEventListener("keydown", function (event) {
    // Check if the Ctrl (Cmd on Mac) key is pressed along with the 'A' key for adding a task
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
        addTask();
    }

    // Check if the 'Enter' key is pressed for marking a task as completed
    if (event.key === 'Enter') {
        const selectedTask = document.querySelector(".checked");
        if (selectedTask) {
            selectedTask.classList.remove("checked");
        } else {
            const taskInput = document.getElementById("input-box");
            if (taskInput === document.activeElement && taskInput.value !== '') {
                addTask();
            }
        }
    }
});
function editTask(liElement) {
    const taskText = liElement.firstChild.textContent;
    const dueDate = liElement.querySelector(".due-date").value;
    
    // Create an input field to edit the task text
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = taskText;
    
    // Replace the task text with the input field
    liElement.firstChild.textContent = "";
    liElement.firstChild.appendChild(editInput);
    
    // Create a save button
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save";
    
    // When the save button is clicked, update the task text
    saveButton.addEventListener("click", function () {
        const newTaskText = editInput.value;
        liElement.firstChild.textContent = newTaskText;
        liElement.querySelector(".due-date").value = dueDate;
        saveData(); // Save the updated data
    });
    
    // Append the save button
    liElement.appendChild(saveButton);
    
    // Disable the edit button
    liElement.querySelector(".edit-button").disabled = true;
    
    // Focus on the edit input field
    editInput.focus();
}

// Add a click event listener to each "Edit" button
const editButtons = document.querySelectorAll(".edit-button");
editButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const liElement = button.parentElement;
        editTask(liElement);
    });
});
function saveData() {
    const tasks = [];
    const dueDates = [];
    
    const taskItems = document.querySelectorAll("#list-container li");
    taskItems.forEach((taskItem) => {
        const taskText = taskItem.firstChild.textContent;
        tasks.push(taskText);
        
        const dueDate = taskItem.querySelector(".due-date").value;
        dueDates.push(dueDate);
    });
    
    const data = {
        tasks,
        dueDates,
    };
    
    localStorage.setItem("data", JSON.stringify(data));
}

// Function to load tasks and due dates from local storage
function loadTasks() {
    const data = JSON.parse(localStorage.getItem("data"));
    
    if (data) {
        for (let i = 0; i < data.tasks.length; i++) {
            const taskText = data.tasks[i];
            const dueDate = data.dueDates[i];
            
            const li = document.createElement("li");
            li.innerHTML = taskText;
            
            const dueDateInput = document.createElement("input");
            dueDateInput.type = "date";
            dueDateInput.className = "due-date";
            dueDateInput.value = dueDate;
            li.appendChild(dueDateInput);
            
            listContainer.appendChild(li);
        }
    }
}
