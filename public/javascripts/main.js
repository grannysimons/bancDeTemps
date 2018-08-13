window.addEventListener('load', ()=>{
  document.querySelector('#filter #submit').addEventListener('click', filter);
  // document.querySelector('#aplicarActivitat #aplicar').addEventListener('click', apply);

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
  axios.get(`http://localhost:3000/api/filter?sector=${sector}&subsector=${subSector}`)
  .then((act) => {
    console.log("then");
    document.getElementById('results').innerHTML = '';
    for(let i=0; i<act.data.activities.length; i++)
    {
        document.getElementById('results').innerHTML += '<li>' + act.data.activities[i].description + '</li>';
    }
  })
  .catch(error => {
    console.log("catch");
    document.getElementById('results').innerHTML = "erroooor!" + error;
  })
} 

function apply(){
  const idActivitat = document.querySelector('#aplicarActivitat #activity').value;
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