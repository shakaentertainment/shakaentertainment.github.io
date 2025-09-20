document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const message = this.message.value.trim();
  if (!name || !email || !message) {
    document.getElementById('formMessage').textContent = 'Please fill in all fields.';
    return;
  }
  // Use mailto to send email
  const subject = encodeURIComponent('Contact from shakaentertainment');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:beshaka33@gmail.com?subject=${subject}&body=${body}`;
  document.getElementById('formMessage').textContent = 'Thank you for reaching out!';
  this.reset();
});