const climbAccordion = document.querySelector('#accordion');
const userAccordion = document.querySelector('#userAccordion');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountModalDeets = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');
const setupUI = user => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = 'block'));
    }
    db.collection('users')
      .doc(user.uid)
      .get()
      .then(res => {
        const html = `
            <div>Logged in as ${user.email}</div>
            <div>About Me: ${res.data().bio}</div>
            <div style="color:pink;">${user.admin ? 'Admin' : ''}</div>`;
        accountModalDeets.innerHTML = html;
      });

    loggedInLinks.forEach(link => (link.style.display = 'block'));
    loggedOutLinks.forEach(link => (link.style.display = 'none'));
  } else {
    accountModalDeets.innerHTML = '';
    adminItems.forEach(item => (item.style.display = 'none'));
    loggedInLinks.forEach(link => (link.style.display = 'none'));
    loggedOutLinks.forEach(link => (link.style.display = 'block'));
  }
};

const setUpClimbs = data => {
  if (data.length) {
    let html = '';
    data.forEach((doc, i) => {
      console.log(doc.id);
      const climb = doc.data();
      console.log(`${JSON.stringify(climb)}, ${i}`);
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
            <button id="${doc.id}" type="button" class="btn btn-success" onclick="saveClimb('${doc.id}')">Save</button>
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

const displaySavedClimbs = data => {
  if (data.length) {
    let html = '';
    data.forEach((doc, i) => {
      const climb = doc;
      console.log(`in displaySavedClimbs : ${JSON.stringify(climb)}, ${i}`);
      const card = `
            <div class="card">
              <div class="card-header" id="headingSavedClimb${i}">
              <h5 class="mb-0">
                <button
                class="btn btn-link"
                data-toggle="collapse"
                data-target="#collapseSavedClimb${i}"
                aria-expanded="true"
                aria-controls="collapse${i}"
                >
                  ${climb.routeName}
                </button>
            </h5>
            </div>
            
            <div
            id="collapseSavedClimb${i}"
            class="collapse"
            aria-labelledby="headingSavedClimb${i}"
            data-parent="#accordion"
            >
              <div class="card-body">
              <p>${climb.routeName}</p>
              <p> Grade: ${climb.grade}</p>
              <button id="remove-${climb.id}" class="btn btn-danger" 
              type="button" 
              onclick="removeClimb('${climb.id}')"
              >Remove
              </button>
              </div>

              </div>
            </div>`;
      html += card;
    });
    userAccordion.innerHTML = html;
  } else {
    const html = `<h5>No Saved Routes</h5>`;
    userAccordion.innerHTML = html;
  }
};
