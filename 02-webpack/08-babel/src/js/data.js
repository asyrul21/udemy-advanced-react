import data from '../todos.json'

export function getAllTodos() {
    return data
}

export function addTodo(todo) {
    data.push(todo)
}

export function removeTodo(id) {
    data = data.filter(function (item) {
        return item.id !== id
    })
}

export function updateTodo(id, completed) {
    const itemIndex = data.findIndex(function (value) {
        return value.id === id
    })
    data[itemIndex].completed = completed
}