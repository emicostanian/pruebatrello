let taskIdCounter = 0; // Contador para generar IDs únicos

// Abrir y cerrar la ventana emergente de el boton agregar*/
function openAgregarModal() {
    document.getElementById('Agregar').style.display = 'block';
}

function closeAgregarModal() {
    document.getElementById('Agregar').style.display = 'none';
}


function addTask() { /*agregar tarea*/
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const assigned = document.getElementById('assigned').value;
    const priority = document.getElementById('priority').value;
    const status = document.getElementById('status').value;
    const deadline = document.getElementById('deadline').value;

    const task = document.createElement('div');
    task.classList.add('task', priority); // Añadir clase de prioridad
    task.setAttribute('draggable', 'true');
    task.setAttribute('data-priority', priority);
    task.setAttribute('data-deadline', deadline);

    // se fija que el id de la tarea sea unico (que no se repita)*/
    taskIdCounter++;
    task.setAttribute('id', `task-${taskIdCounter}`);

    //drag
    task.ondragstart = drag;

    task.innerHTML = `
        <p><strong>${title}</strong></p>
        <p>${description}</p>
        <p>Asignado a: ${assigned}</p>
        <p>Prioridad: ${priority}</p>
        <p>Fecha límite: ${deadline}</p>
    `;

    document.querySelector(`.column[data-status="${status}"] .task-container`).appendChild(task);

    // Ordenar tareas por fecha de vencimiento
    ordenarPorFecha(status);

    closeAgregarModal();
}


function allowDrop(event) { /*drag and drop*/
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();

    let taskId;
    if (event.type === "drop") {
        taskId = event.dataTransfer.getData("text");
    } else if (event.type === "touchend") {
        taskId = event.target.id; // Aquí usamos `event.target.id` directamente
    }

    if (!taskId) return;

    const taskElement = document.getElementById(taskId);
    const targetColumn = event.target.closest('.column').querySelector('.task-container');

    if (taskElement && targetColumn) {
        targetColumn.appendChild(taskElement);

        /* Mantener el color de prioridad */
        const priority = taskElement.getAttribute('data-priority');
        taskElement.classList.remove('low', 'medium', 'high');
        taskElement.classList.add(priority);

        /* Ordenar por fecha */
        const status = targetColumn.closest('.column').dataset.status;
        ordenarPorFecha(status);
    }
}


function ordenarPorFecha(status) {
    const column = document.querySelector(`[data-status="${status}"] .task-container`);
    const tasks = Array.from(column.children);

    tasks.sort((a, b) => {
        const dateA = new Date(a.getAttribute('data-due-date'));
        const dateB = new Date(b.getAttribute('data-due-date'));
        return dateA - dateB;
    });

    tasks.forEach(task => column.appendChild(task));
}


function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    
    const btn = document.getElementById("darkModeToggle");
    if (document.body.classList.contains("dark-mode")) {
        btn.textContent = "Modo Claro"; // Cambia el texto del botón a "Modo Claro" cuando el modo oscuro está activado
    } else {
        btn.textContent = "Modo Oscuro"; // Cambia el texto del botón a "Modo Oscuro" cuando el modo claro está activado
    }
}

function drag(event) {
    if (event.type === "touchstart") {
        event.dataTransfer = event.target;
    } else {
        event.dataTransfer.setData("text", event.target.id);
    }
}

document.querySelectorAll('.task').forEach(task => {
    task.addEventListener('dragstart', drag);
    task.addEventListener('touchstart', drag); // Añadir soporte para dispositivos móviles
});

document.querySelectorAll('.task-container').forEach(container => {
    container.addEventListener('dragover', allowDrop);
    container.addEventListener('drop', drop);
    container.addEventListener('touchend', drop); // Añadir soporte para dispositivos móviles
});
