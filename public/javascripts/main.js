window.addEventListener('load', ()=>{
  filter();
  document.querySelector('#filter #submit').addEventListener('click', filter);
  document.querySelector('#aplicarActivitat').addEventListener('click', apply);

  var viewportHeight = $(window).height();  
  var viewportWidth = $(window).width();

  var heightNavBar = document.getElementById('navbar-main').offsetHeight;
  console.log('La altura del icono menu es de:',heightNavBar);

  var heightMainTitle = viewportHeight-2*heightNavBar;
  document.getElementById('text-banc').setAttribute("style",`height:${heightMainTitle}px`);
  document.getElementById('footer-main-page').setAttribute("style",`height:${heightNavBar}px`);
  // document.getElementById('new').setAttribute("style",`height:${viewportHeight}px`);
  var linkLogin = document.getElementById("my-login");

});

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

// $( window ).resize(function() {
//   viewportHeight = $(window).height(); 
//   heightMainTitle = viewportHeight-2*heightNavBar;
//   document.getElementById('text-banc').setAttribute("style",`height:${heightMainTitle}px`);
//   document.getElementById('footer-main-page').setAttribute("style",`height:${heightNavBar}px`);
//   document.getElementById('new').setAttribute("style",`height:${viewportHeight}px`);
// });


function filter(){
  const sector = document.getElementById('sector').value;
  const subSector = document.getElementById('subsector').value;
  const user = document.getElementById('user').value;
  axios.get(`http://localhost:3000/api/filter?sector=${sector}&subsector=${subSector}&userName=${user}`)
  .then((act) => {
    console.log("then ",act);
    document.getElementById('results').innerHTML = '';
    for(let i=0; i<act.data.activities.length; i++)
    {
      const element = 
      `<div>
      ${act.data.activities[i].description}
      </div>
      <div>
      duration: ${act.data.activities[i].duration} hours
      </div>
      <button type="button" class="btn btn-info" id="aplicarActivitat">Apply</button>`;
      document.getElementById('results').innerHTML += '<li>' + element + '</li>';
    }
  })
  .catch(error => {
    console.log("catch");
    document.getElementById('results').innerHTML = "erroooor!" + error;
  })
} 

function apply(){
  const idActivitat = document.querySelector('#aplicarActivitat').value;
  axios.get(`http://localhost:3000/api/${idActivitat}/request`)
  .then(act => {
    document.getElementById('results').innerHTML = 'activitat '+idActivitat+' demanada correctament. Ara toca esperar';
  })
  .catch(error => {
    document.getElementById('results').innerHTML = "erroooor!" + error;
  })
}

function openModal(){
  $('#ModalLogin').modal('show');
}       
