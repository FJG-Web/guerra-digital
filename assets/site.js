const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll(); window.addEventListener('scroll', onScroll, { passive:true });

const btn = document.getElementById('menuBtn');
const links = document.getElementById('navLinks');
btn.addEventListener('click', () => links.classList.toggle('open'));
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

const io = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting){ setTimeout(() => e.target.classList.add('in'), i * 70); io.unobserve(e.target); }
  });
}, { threshold:.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// contact form -> Web3Forms (AJAX, with inline status)
const cform = document.querySelector('.contact-form');
if (cform) {
  const status = document.getElementById('form-status');
  cform.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cform.checkValidity()) { cform.reportValidity(); return; }
    const btn = cform.querySelector('button[type="submit"]');
    const label = btn.textContent;
    btn.textContent = 'Sending…'; btn.disabled = true;
    status.textContent = ''; status.style.color = 'var(--ink-faint)';
    try {
      const res = await fetch(cform.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(cform)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        cform.reset();
        status.textContent = '✓ Message sent — I will get back to you within one business day.';
        status.style.color = 'var(--cyan)';
      } else {
        status.textContent = 'Could not send. Please email info@guerradigitalstudio.com directly.';
        status.style.color = '#dc2626';
      }
    } catch (err) {
      status.textContent = 'Network error. Please email info@guerradigitalstudio.com directly.';
      status.style.color = '#dc2626';
    } finally {
      btn.textContent = label; btn.disabled = false;
    }
  });
}
