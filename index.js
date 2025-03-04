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
            displayTodos(todos.filter(todo => todo.user.toLowerCase() === username))
            break;
        case 'show':
            displayTodos(todos)
            break;
        case 'important':
            displayTodos(todos.filter(todo => ~todo.text.indexOf("!")));
            break;
        case 'sort':
            const sortBy = args[0];
            sortTodos(sortBy);
            break;
        case 'date':
            const dateStr = args[0];
            const filteredTodos = filterTodosByDate(dateStr);
            for (const elem of filteredTodos){
                console.log(elem);
            }
            break;
        default:
            console.log('wrong command');
            break;
    }
}

function extractTodos(files) {
    const todos = [];

    const todoRegex = /\/\/\s*TODO\s*:?\s*(.*)/i;

    files.forEach((fileContent, fileName) => {
        const lines = fileContent.split('\n');

        lines.forEach((line) => {
            const match = line.match(todoRegex);
            if (match) {
                let text = match[1].trim();
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
            sortedTodos = todos.sort((a, b) => compareImportance(a.text, b.text));
            break;
        case 'user':
            sortedTodos = todos.sort((a, b) => a.user.toLowerCase().localeCompare(b.user.toLowerCase()));
            break;
        case 'date':
            sortedTodos = todos.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        default:
            console.log('Неверный критерий сортировки');
            return;
    }
    displayTodos(sortedTodos);
}

function compareImportance(x, y){
    let xImportance = (x.match(/!/g) || []).length;
    let yImportance = (y.match(/!/g) || []).length;
    return yImportance - xImportance;

}
function displayTodos(todos) {
    let maxUserLength = 0;
    let maxDateLength = 0;
    let maxCommentLength = 0;

    todos.forEach(todo => {
        maxUserLength = Math.max(maxUserLength, todo.user ? todo.user.length : 3);
        maxDateLength = Math.max(maxDateLength, todo.date ? todo.date.length : 3);
        maxCommentLength = Math.max(maxCommentLength, todo.text.length);
    });
    maxUserLength = Math.min(maxUserLength, 10);
    maxDateLength = Math.min(maxDateLength, 10);
    maxCommentLength = Math.min(maxCommentLength, 50);


    console.log(`!  |  user${' '.repeat(maxUserLength - 4)} |  date${' '.repeat(maxDateLength - 4)} | comment${' '.repeat(maxCommentLength - 7)}`);
    console.log('-'.repeat(3 + maxUserLength + maxDateLength + maxCommentLength));

    todos.forEach(todo => {
        let importance = todo.text.includes('!') ? '!' : ' ';
        let user = todo.user || '---';
        user = user.length > 10 ? user.slice(0, 7) + '...' : user;

        let date = todo.date || '---';
        date = date.length > 10 ? date.slice(0, 7) + '...' : date;

        let comment = todo.text.length > maxCommentLength ? todo.text.slice(0, maxCommentLength - 3) + '...' : todo.text;


        console.log(`${importance.padEnd(1)}  |  ${user.padEnd(maxUserLength)}  |  ${date.padEnd(maxDateLength)}  |  ${comment.padEnd(maxCommentLength)}`);
    });

    console.log('-'.repeat(3 + maxUserLength + maxDateLength + maxCommentLength + 6));
}

function filterTodosByDate(dateStr) {
    const parts = dateStr.split('-').map(Number);
    let year = parts[0];
    let month = parts[1] || 1;
    let day = parts[2] || 1;

    const targetDate = new Date(year, month - 1, day);

    return todos.filter(todo => {
        if (!todo.date) return false;
        const todoDate = new Date(todo.date);
        return todoDate >= targetDate;
    });
}




// TODO you can do it!
