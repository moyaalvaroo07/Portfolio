const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

//back base de datos
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  const messageElement = document.getElementById('loginMessage');

  if (response.status === 200) {
    messageElement.textContent = data.message;
    messageElement.style.color = 'green';

    window.location.href = 'http://localhost:5500/Ecommerce/';
  } else {
    messageElement.textContent = data.message;
    messageElement.style.color = 'red';
  }
});

document.getElementById('registerForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
    });
    
    const data = await response.json();
    const messageElement = document.getElementById('registerMessage');
  
    if (response.status === 201) {
        messageElement.textContent = data.message;
        messageElement.style.color = 'green';
    } else {
        messageElement.textContent = data.message;
        messageElement.style.color = 'red';
    }
} catch (error) {
    console.error('Error de red:', error);
    document.getElementById('registerMessage').textContent = 'Error de conexión con el servidor.';
}
});
