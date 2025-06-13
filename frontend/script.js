const API_BASE_URL = 'http://localhost:3000';

function getToken(){
    return localStorage.getItem('token');
}

function setToken(token){
    return localStorage.setItem('token' , token);
}

function removeToken(){
    return localStorage.removeItem('token');
}

// ------------ AUTH FUNCTIONS ---------------------

//login function
async function loginUser(){
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!emailInput || !passwordInput) {
        console.error("Email or password input field not found");
        alert("A critical error occurred. Please contact support.");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    console.log("Attempting login with:", { email, password }); // Debug log

    try{
        const response = await fetch(API_BASE_URL + '/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email:email,
                password: password
            })
        });
        const result = await response.json();
        console.log("Login response:", response); // Debug log
        console.log("Login result:", result); // Debug log

        if(response.ok){
            setToken(result.token);
            alert("Login Successfull!")
            window.location.href = 'todo.html'; // Correct: todo.html is in the same folder as login.html
        }else {
            alert("Login failed"+ result.message)
        }
    }catch(e){
        console.error("Login error", e); // Changed to console.error for better visibility
        alert("Something went wrong during login!");
    }
}

//signup function
async function signupUser(){
    const firstNameInput = document.getElementById('first_name');
    const lastNameInput = document.getElementById('last_name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    if (!firstNameInput || !lastNameInput || !emailInput || !passwordInput) {
        console.error("One or more signup input fields not found");
        alert("A critical error occurred with the signup form. Please contact support.");
        return;
    }

    const first_name = firstNameInput.value;
    const last_name = lastNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const name = first_name + " " + last_name;
    console.log("Attempting signup with:", { name, email, password }); // Debug log

    try{
        const response = await fetch(API_BASE_URL + '/signup',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        })
        const result = await response.json();
        console.log("Signup response:", response); // Debug log
        console.log("Signup result:", result); // Debug log

        if(response.ok){
            alert("Signed Up! Please login with your credentials.")
            window.location.href = 'login.html'; // Correct: login.html is in the same folder as signup.html
        }else{
            alert("Signup failed: " + result.message)
        }
    }catch(e){
        console.error("Signup error", e); // Changed to console.error
        alert("Something went wrong during signup.")
    }
}

//logout function

function logoutUser(){
    removeToken();
    alert("Logged Out!");
    window.location.href = "../index.html";
}

//check if logged in

function checkIfLoggedIn(){
    const token = getToken();

    if(!token){
        return false;
    }

    return true;
}



// --------TODO FUNCTIONS -----------

//loading all todos
async function loadAllTodos(){
    try{
        const response = await fetch(API_BASE_URL + '/todos' ,{
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        });
        const result = await response.json();
        if(response.ok){
            showTodosOnPage(result.todos);
        }else{
            alert("Failed to load todos: " + result.message)
        }
    }catch(e){
        alert("Error loading todos.");
    }
}

// showing all todos on page
async function showTodosOnPage(todos){
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-todo-list');
    const emptyTodoMessage = document.getElementById('empty-todo-message');
    const todosSectionHeading = document.querySelector('.todos-section h3'); // Select the H3 heading

    todoList.innerHTML = '';
    completedList.innerHTML = '';
    let completedCount = 0;


    todos.forEach(todo => {
        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" ${todo.done ? 'checked' : ''} onchange="toggleTodo('${todo._id}', ${!todo.done})">
        <span class="${todo.done ? 'completed' : ''}">${todo.title}</span>
        <button onclick="deleteTodoItem('${todo._id}')">Delete</button>
        `

        if(todo.done){
            completedList.appendChild(li);
            completedCount++;
        }else {
            todoList.appendChild(li);
        }
    });
    document.querySelector('.lower-heading').textContent = completedCount > 0 ? 'Completed Todos:' : '';

    // Show or hide the empty todo message and the "Todos:" heading
    if (todoList.children.length === 0) {
        if (emptyTodoMessage) {
            emptyTodoMessage.style.display = 'block';
        }
        if (todosSectionHeading) {
            todosSectionHeading.style.display = 'none'; // Hide heading
        }
    } else {
        if (emptyTodoMessage) {
            emptyTodoMessage.style.display = 'none';
        }
        if (todosSectionHeading) {
            todosSectionHeading.style.display = 'block'; // Show heading
        }
    }
}

// toggle todo status completion
async function toggleTodo(id , done){
    try {
        const response = await fetch(API_BASE_URL + '/todo/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getToken()
            },
            body: JSON.stringify({ done })
        });
        if (response.ok) {
            loadAllTodos();
        } else {
            const result = await response.json();
            alert("Failed to update todo: " + result.message);
        }
    } catch (e) {
        alert("Error updating todo.");
    }
}

//deleting a todo

async function deleteTodoItem(id) {
    if (!confirm("Delete this todo?")) return;
    try {
        const response = await fetch(API_BASE_URL + '/todo/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        });
        if (response.ok) {
            loadAllTodos();
        } else {
            const result = await response.json();
            alert("Failed to delete todo: " + result.message);
        }
    } catch (e) {
        alert("Error deleting todo.");
    }
}

async function showUserGreeting() {
    try {
        const response = await fetch(API_BASE_URL + '/me', {
            headers: {
                'Authorization': 'Bearer ' + getToken()
            }
        });
        if (response.ok) {
            const data = await response.json();
            const firstName = data.user.split(' ')[0]; // Extract first name
            document.querySelector('.intro').textContent = `Welcome back, ${firstName} 👋!`;
        }
    } catch (e) {
        // ignore
    }
}


// Add this function above DOMContentLoaded
function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const title = todoInput.value.trim();
    if(!title){
        alert("Please enter a todo");
        return;
    }
    (async () => {
        try{
            const response = await fetch(API_BASE_URL +'/todo',{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({title})
            });
            if(response.ok){
                todoInput.value ='';
                loadAllTodos();
            }else{
                const result = await response.json();
                alert("Failed to add todo" + result.message)
            }
        }catch(e){
            alert("Error adding todo");
        }
    })();
}

// ---------page setup-----------


document.addEventListener('DOMContentLoaded', function() {
    // For todo.html
    if (window.location.pathname.includes('todo.html')) {
        if (!checkIfLoggedIn()) {
            alert("Please login first!");
            window.location.href = 'login.html';
            return;
        }
        // Attach submit event to the todo form
        const todoForm = document.getElementById('todo-form');
        if (todoForm) {
            todoForm.onsubmit = function(e) {
                e.preventDefault();
                addTodo();
            };
        }
        document.getElementById('logout-btn').onclick = logoutUser;
        loadAllTodos();
        showUserGreeting();
    }

    // For login.html
    if (window.location.pathname.includes('login.html')) {
        const loginForm = document.getElementById('loginForm'); // Use ID
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) { // Use addEventListener
                e.preventDefault();
                loginUser();
            });
        } else {
            console.error("loginForm not found on login.html");
        }
    }

    // For signup.html
    if (window.location.pathname.includes('signup.html')) {
        const signupForm = document.getElementById('signupForm'); // Use ID
        if (signupForm) {
            signupForm.addEventListener('submit', function(e) { // Use addEventListener
                e.preventDefault();
                signupUser();
            });
        } else {
            console.error("signupForm not found on signup.html");
        }
    }
});







