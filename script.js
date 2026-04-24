/* ============================================================
   script.js — Nathan Gillespie Personal Website JavaScript
   ============================================================
   Keeps interactivity minimal and dependency-free.
   All functionality is plain vanilla JS.
   ============================================================ */

/* ---------- Mobile Navigation Toggle ---------- */
/*
   When the hamburger button is clicked on small screens,
   we add/remove the "open" class on the nav links list.
   The CSS handles the actual show/hide with display:flex.
*/
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');

    /* Accessibility: update aria-expanded so screen readers
       know whether the menu is open or closed. */
    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  /* Close the mobile menu when any nav link is clicked
     (avoids the menu staying open after navigating to a section). */
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });
}

/* ---------- Active Nav Link Highlighting ---------- */
/*
   Uses IntersectionObserver to detect which section is currently
   visible in the viewport and highlights the matching nav link.
   This gives users a visual cue of where they are on the page.

   rootMargin: '-60px 0px -85% 0px'
     -60px top   → the 60px navbar is excluded from the detection zone,
                   so a section is only "seen" once its heading clears the bar.
     -85% bottom → shrinks the detection zone to the top ~15% of the
                   remaining viewport. This means a section becomes active
                   as soon as its top edge scrolls into that narrow band,
                   not when half the section is visible. This prevents the
                   next section from stealing the highlight prematurely.

   threshold: 0 → fire as soon as even 1px of the section enters the zone.
*/
const sections  = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.navbar__links a');

const observerOptions = {
  rootMargin: '-60px 0px -85% 0px',
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      /* Remove active class from all links */
      navAnchors.forEach(a => a.classList.remove('nav-active'));

      /* Add active class to the link matching the visible section */
      const activeLink = document.querySelector(
        `.navbar__links a[href="#${entry.target.id}"]`
      );
      if (activeLink) activeLink.classList.add('nav-active');
    }
  });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

/* Add the active style inline since it's JS-driven */
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .navbar__links a.nav-active {
    color: #FFFFFF !important;
    border-bottom: 2px solid #B8883A;
    padding-bottom: 2px;
  }
`;
document.head.appendChild(activeStyle);

/* ---------- Contact Form Submission ---------- */
/*
   This is a client-side-only placeholder handler.
   To make the form actually send email you can:
     Option A: Connect to a backend endpoint (Flask, Node, etc.)
     Option B: Use a service like Formspree (https://formspree.io)
               by changing the form's action attribute and method to POST.
   For now, we simply prevent the default submit and show a message.
*/
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); /* Prevent page reload */

    /* --- Replace this block with a real fetch() call or Formspree --- */
    /*
       Example Formspree integration:
         const data = new FormData(contactForm);
         await fetch('https://formspree.io/f/YOUR_FORM_ID', {
           method: 'POST',
           body: data,
           headers: { 'Accept': 'application/json' }
         });
    */

    /* Show a success message to the user */
    if (formMessage) {
      formMessage.textContent =
        'Thank you for your message! I will get back to you soon.';
      formMessage.style.color = '#2ecc71';
      formMessage.style.marginTop = '0.5rem';
    }

    contactForm.reset(); /* Clear the form fields */
  });
}

/* ---------- Current Year in Footer ---------- */
/*
   Keeps the copyright year in the footer up to date automatically.
   The <span id="year"> in index.html will be filled here.
*/
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}
