// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// Form validationт
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('reqName').value.trim();
  const email = document.getElementById('reqEmail').value.trim();
  const phone = document.getElementById('reqPhone').value.trim();

  document.querySelectorAll('.error-msg').forEach(el => el.classList.remove('visible'));

  let valid = true;

  if (!name) {
    document.getElementById('nameError').classList.add('visible');
    valid = false;
  }

  const emailValid = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phoneValid = phone && phone.replace(/\D/g, '').length >= 10;

  if (email && !emailValid) {
    document.getElementById('emailError').classList.add('visible');
    valid = false;
  }

  if (!emailValid && !phoneValid) {
    document.getElementById('contactError').classList.add('visible');
    valid = false;
  }

  if (valid) {
  contactForm.submit();
  }
});
