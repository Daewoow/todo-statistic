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
    const [cmd, ...args] = command.trim().split(' ');
    switch (cmd) {
        case 'exit':
            process.exit(0);
            break;
        case 'user':
            const username = args[0].toLowerCase();
            displayTodos(todos.filter(todo => todo.toLowerCase().includes(username)))
        case 'show':
            displayTodos(todos)
            break;
        case 'important':
            displayTodos(todos.filter(todo => ~todo.indexOf("!")));
            break;
        case 'sort':
            const sortBy = args[0];
            sortTodos(sortBy);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function extractTodos(files) {
    let todos = [];

    files.forEach((fileContent, fileName) => {
        const lines = fileContent.split('\n');
        lines.forEach((line) => {
            line = line.trim();
            if (line.startsWith('// TODO')) {
                let text = line.slice(7).trim();
                let user = '', date = '';
                const parts = text.split(';').map(part => part.trim());

                if (parts.length === 3) {
                    user = parts[0];
                    date = parts[1];
                    text = parts[2];
                } else if (parts.length === 2) {
                    user = parts[0];
                    date = parts[1];
                    text = '';
                } else if (parts.length === 1) {
                    text = parts[0];
                }

                user = user.trim();
                date = date.trim();
                todos.push({ text, file: fileName, user, date });
            }
        });
    });

    return todos;
}


function sortTodos(param) {
    let sortedTodos = [];
    switch (param) {
        case 'importance':
            sortedTodos = todos.sort((a, b) => (b.text.includes('!') ? 1 : 0) - (a.text.includes('!') ? 1 : 0));
            break;
        case 'user':
            sortedTodos = todos.sort((a, b) => a.user.toLowerCase().localeCompare(b.user.toLowerCase()));
            break;
        case 'date':
            sortedTodos = todos.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        default:
            console.log('Invalid sort criteria');
            return;
    }
    displayTodos(sortedTodos);
}

function displayTodos(todos) {
    console.log(` !  |  user       |  date       | comment`);
    console.log(`---------------------------------------------`);

    todos.forEach(todo => {
        let importance = todo.text.includes('!') ? '!' : ' ';
        let user = todo.user || '---';
        let date = todo.date || '---';
        let comment = todo.text.length > 50 ? todo.text.slice(0, 47) + '...' : todo.text;

        console.log(`${importance.padEnd(2)}|  ${user.padEnd(10)}|  ${date.padEnd(10)}|  ${comment.padEnd(50)}`);
    });

    console.log(`---------------------------------------------`);
}


// TODO you can do it!
