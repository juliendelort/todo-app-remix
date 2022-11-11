
const fs = require('fs');
const path = require('path');

export async function getAllTasks() {
    return readData();
}

export async function getCompletedTasks() {
    const tasks = await readData();
    return tasks.filter(t => t.completed);
}

export async function getActiveTasks() {
    const tasks = await readData();

    return tasks.filter(t => !t.completed);
}

export async function getCounts() {
    const tasks = await readData();
    const countAll = tasks.length;
    const countCompleted = tasks.filter(t => t.completed).length;
    const countActive = tasks.filter(t => !t.completed).length;

    return {
        countAll,
        countCompleted,
        countActive
    };
}

export async function setCompleted(id, completed) {
    const tasks = await readData();

    const editedTask = { ...tasks.find(t => t.id === +id), completed };
    await writeData(tasks.map(t => (t.id === +id ? editedTask : t)));

    return editedTask;
}

export async function addTask(text) {
    const tasks = await readData();
    const newTask = {
        id: tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        text,
        completed: false
    };
    await writeData([...tasks, newTask]);
    return newTask;
}

export async function clearCompleted() {
    const tasks = await readData();
    const result = tasks.filter(t => !t.completed);
    await writeData(result);
    return result;
}

async function readData() {
    const result = await fetch('https://api.jsonbin.io/v3/b/636eccf82b3499323bfd19a5', {
        method: 'GET',
        headers: {
            'X-Master-Key': process.env.MASTER_KEY,
            'X-Access-Key': process.env.ACCESS_KEY
        }
    });

    const data = await result.json();
    return data.record.tasks;
}

async function writeData(tasks) {
    const result = await fetch('https://api.jsonbin.io/v3/b/636eccf82b3499323bfd19a5', {
        method: 'PUT',
        headers: {
            'X-Master-Key': '$2b$10$0VffX9c9dU7k.P3dlAkv.u8HCRjw3LVxl/KALXhHqUaZlMCk52Lvq',
            'X-Access-Key': '$2b$10$vG6bM/uF3yx7OzDK2b8v0.XJgdr0V9pmyrLVd6DR0Z5ol8FX8AqGa',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tasks })
    });

    const data = await result.json();
    return data.record.tasks;
}
