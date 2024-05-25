const form = document.querySelector('[data-id="form"]');

const API_URL = '/api/sessions/sign-in';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

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
        email: email.value,

        password: password.value
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      console.log(data);
      location.assign('/dashboard');
    }
  } catch (error) {
    alert(error.message);
    console.log(event.target);
  }
});
