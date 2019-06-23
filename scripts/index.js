const climbAccordion = document.querySelector('#accordion');
const setUpClimbs = data => {
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
                  class="collapse show"
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
};
