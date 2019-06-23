const climbAccordion = document.querySelector('#accordion');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const setupUI = user => {
  if (user) {
    loggedInLinks.forEach(link => (link.style.display = 'block'));
    loggedOutLinks.forEach(link => (link.style.display = 'none'));
  } else {
    loggedInLinks.forEach(link => (link.style.display = 'none'));
    loggedOutLinks.forEach(link => (link.style.display = 'block'));
  }
};

const setUpClimbs = data => {
  if (data.length) {
    let html = '';
    data.forEach((doc, i) => {
      const climb = doc.data();
      console.log(`${climb}, ${i}`);
      const card = `
            <div class="card">
            <div class="card-header" id="heading${i}">
            <h5 class="mb-0">
            <button
            class="btn btn-link"
            data-toggle="collapse"
            data-target="#collapse${i}"
            aria-expanded="true"
            aria-controls="collapse${i}"
            >
            ${climb.routeName}
            </button>
            </h5>
            </div>
            
            <div
            id="collapse${i}"
            class="collapse"
            aria-labelledby="heading${i}"
            data-parent="#accordion"
            >
            <div class="card-body">
            <p>${climb.routeName}</p>
            <p>${climb.grade}</p>
            </div>
            </div>
            </div>`;
      html += card;
    });
    climbAccordion.innerHTML = html;
  } else {
    const html = `<h5>login to view routes</h5>`;
    climbAccordion.innerHTML = html;
  }
};
