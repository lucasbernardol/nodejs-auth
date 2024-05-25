const form = document.querySelector('[data-id="form"]');

const spinner = document.querySelector('[data-id="spinner"]');

const API_URL = '/api/sessions/sign-in';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  spinner.classList.add('open');

  const email = event.target.email;
  const password = event.target.password;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // prettier-ignore
      body: JSON.stringify({
        email: email.value.toLowerCase(),

        password: password.value
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log(data);
      location.assign('/dashboard');
    }

    if (response.status === 400) {
      alert('Credenciais invalidas!');
    }
  } catch (error) {
    alert(error.message);
    console.log(event.target);
  }
});
