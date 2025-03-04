const {getAllFilePathsWithExtension, readFile} = require('./fileSystem');
const {readLine} = require('./console');

const files = getFiles();
const todos = extractTodos(files);

console.log('Please, write your command!');
readLine(processCommand);

function getFiles() {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js');
    return filePaths.map(path => readFile(path));
}

function processCommand(command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            for (const todo of todos) {
                console.log(todo);
            }
            break;
        case 'important':
            for (const todo of todos){
                if (~todo.indexOf("!")){
                    console.log(todo);
                }
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function extractTodos(files) {
    const todoRegex = /\/\/\s*TODO:?\s*(.*)/gi;
    let todos = [];

    for (const file of files) {
        const lines = file.split('\n');
        for (const line of lines) {
            const match = line.match(todoRegex);
            if (match) {
                todos = todos.concat(match);
            }
        }
    }
    return todos;
}

// TODO you can do it!
