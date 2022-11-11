
const fs = require('fs');


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
    const countAll = (await getAllTasks()).length;
    const countCompleted = (await getCompletedTasks()).length;
    const countActive = (await getActiveTasks()).length;

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
        id: Math.max(...tasks.map(t => t.id)) + 1,
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
    return new Promise((resolve, reject) => {
        fs.readFile('data/tasks.json', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

async function writeData(tasks) {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/tasks.json', JSON.stringify(tasks), (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
