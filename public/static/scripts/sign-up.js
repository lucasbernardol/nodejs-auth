const form = document.querySelector('[data-id="form"]');
const modal = document.querySelector('[data-id="modal"]');

const sucessButton = document.querySelector('[data-id="sucess-redirect"]');

const spinner = document.querySelector('[data-id="spinner"]');

const API_URL = '/api/sessions/sign-up';

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  spinner.classList.add('open');

  const name = event.target.name;
  const email = event.target.email;
  const password = event.target.password;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        email: email.value.toLowerCase(),
        password: password.value,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (response.status === 200) {
      modal.classList.add('open');
      spinner.classList.remove('open');

      sucessButton.addEventListener('click', () => location.assign('/sign-in'));
    }
  } catch (error) {
    //alert(error.message);
    alert('Ocorreu um erro interno!');
  }
});
