window.addEventListener('load', ()=>{
  filter();
  document.querySelector('#filter #submit').addEventListener('click', filter);

  var viewportHeight = $(window).height();  
  var viewportWidth = $(window).width();

  var heightNavBar = document.getElementById('navbar-main').offsetHeight;
  // console.log('La altura del icono menu es de:',heightNavBar);

  var heightMainTitle = viewportHeight-2*heightNavBar;
  document.getElementById('text-banc').setAttribute("style",`height:${heightMainTitle}px`);
  document.getElementById('footer-main-page').setAttribute("style",`height:${heightNavBar}px`);
  // document.getElementById('new').setAttribute("style",`height:${viewportHeight}px`);
  var linkLogin = document.getElementById("my-login");

  //smooth scroll
  const y = document.getElementById('search-form').offsetHeight;
  document.getElementById('scroll').onclick = function () {
    scrollTo(document.body, y, 500);   
  }
    
  function scrollTo(element, to, duration) {
    var start = element.scrollTop,
        change = to - start,
        currentTime = 0,
        increment = 20;
        
    var animateScroll = function(){        
        currentTime += increment;
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        element.scrollTop = val;
        if(currentTime < duration) {
            setTimeout(animateScroll, increment);
        }
    };
    animateScroll();
  }

  Math.easeInOutQuad = function (t, b, c, d) {
  t /= d/2;
  if (t < 1) return c/2*t*t + b;
  t--;
  return -c/2 * (t*(t-2) - 1) + b;
  };

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
    // console.log(act.data);
    document.getElementById('results').innerHTML = '';
    for(let i=0; i<act.data.activities.length; i++)
    {
      let divDescription = document.createElement('div');
      divDescription.innerHTML = act.data.activities[i].description;
      let divDuration = document.createElement('div');
      divDuration.innerHTML = 'duration: ' + act.data.activities[i].duration + 'hours';
      document.getElementById('results').appendChild(divDescription);
      document.getElementById('results').appendChild(divDuration);
      
      if(act.data.currentUser) 
      {
        let dynamicClass = 'apply-'+act.data.activities[i]._id;
        let buttonApply = document.createElement('button');
        buttonApply.classList.add('btn', 'btn-info', dynamicClass);
        buttonApply.setAttribute('id', 'apply-'+i);
        buttonApply.addEventListener('click', apply);
        buttonApply.innerHTML = 'Apply';

        document.getElementById('results').appendChild(buttonApply);
      }

    }
  })
  .catch(error => {
    document.getElementById('results').innerHTML = "erroooor!" + error;
  })
} 

function apply(e){
  const idActivitat = e.target.classList[2].substring(6);
  console.log(`http://localhost:3000/api/${idActivitat}/request`);
  axios.get(`http://localhost:3000/api/${idActivitat}/request`)
  .then(act => {
    if (act.data.message === 'ok')
    {
      document.getElementById('results').innerHTML = 'activitat '+idActivitat+' demanada correctament. Ara toca esperar';
    }
    else
    {
      document.getElementById('results').innerHTML = "1 erroooor!" + act.data.message;
    }
  })
  .catch(error => {
    console.log('error: ', error.response.data);
    document.getElementById('results').innerHTML = error.response.data.error;
  })
}

function openModal(){
  $('#ModalLogin').modal('show');
} 

function filterUserActivities() {
console.log('hem entrat a AXIOS');  
const user = document.getElementById('usrName').value;
  const sector = "";
  const subsector = "";
  axios.get(`http://localhost:3000/api/filterUserActivities?sector=${sector}&subsector=${subSector}&userName=${usrName}`)
  .then((act) => {
    // console.log(act.data);
    document.getElementById('results-activities').innerHTML = '';
    for(let i=0; i<act.data.activities.length; i++)
    {
      let divDescription = document.createElement('div');
      divDescription.innerHTML = act.data.activities[i].description;
      let divDuration = document.createElement('div');
      divDuration.innerHTML = 'duration: ' + act.data.activities[i].duration + 'hours';
      document.getElementById('results-activities').appendChild(divDescription);
      document.getElementById('results-activities').appendChild(divDuration);
      
      if(act.data.currentUser) 
      {
        let dynamicClass = 'apply-'+act.data.activities[i]._id;
        let buttonApply = document.createElement('button');
        buttonApply.classList.add('btn', 'btn-info', dynamicClass);
        buttonApply.setAttribute('id', 'apply-'+i);
        buttonApply.addEventListener('click', apply);
        buttonApply.innerHTML = 'Apply';

        document.getElementById('results-activities').appendChild(buttonApply);
      }

    }
  })
  .catch(error => {
    document.getElementById('results-activities').innerHTML = "erroooor!" + error;
  })
} 


  function performGetRequest2() {
    var offertingUserId = undefined;
    var demandingUserId = undefined;
    var resultElement = document.getElementById('getResult2');
    var usrName = document.getElementById('usrName').value;
    resultElement.innerHTML = '';
    const sector = "";
    const subSector = "";
    
        console.log('el valor de demanding user es:',demandingUserId);
    console.log('estem dins de AXIOS');
    // we need to get the user_id in order to create the transaction later
    axios.get(`http://localhost:3000/api/getUserId?userName=${usrName}`)
    .then((response) => {
      console.log('aquesta es la resposta:',response);
      console.log('el valor de userid es:',response.data.userid);
      if (response.data.userid) {
        console.log('hem entrat dins el if');
        offertingUserId = response.data.userid;
        
      }
    })
    .catch((error) => {
      // console.log(error);
      resultElement.innerHTML = `<p>There has been an error:  ${error}</p>`;
      // resultElement.innerHTML = generateErrorHTMLOutput(error);
    });


    axios.get(`http://localhost:3000/api/filterUserActivities?sector=${sector}&subsector=${subSector}&userName=${usrName}`)
    .then((response) => {
      console.log('aquesta es la resposta:',response);
      if (response.data.activities.length>0) {
        demandingUserId = response.data.currentUser._id;
        // var activitiesArray = response.data.activities;
        // resultElement.innerHTML = '<p>This user has activities to offer</p>';
        for(let i=0; i<response.data.activities.length; i++)
          { 
            let dataTransaction = {
              offertingUserId: offertingUserId,
              demandingUserId: demandingUserId,
              activityId: response.data.activities[i]._id,
              status: 'Proposed'
            };


            // we convert it to a JSON data, and we attach to an attribute 'data-profile' in the button element
            let myJsonData = JSON.stringify(dataTransaction);
            console.log(myJsonData);

            
            let divElement = document.createElement('div');
            divElement.innerHTML = `<p><b><u>Activity # ${i+1}</u></b></p>
                                       <p><b>Description: </b>${response.data.activities[i].description} </p>
                                       <p><b>Sector: </b>${response.data.activities[i].sector} </p>
                                       <p><b>Sub Sector: </b>${response.data.activities[i].subsector} </p>
                                       <p><b>Duration: </b>${response.data.activities[i].duration} hours</p>`
            divElement.classList.add('activity-in-transactionManager');
            let buttonElement = document.createElement('button');
            buttonElement.innerHTML = 'Apply for transaction';
            buttonElement.setAttribute('id', 'applytransaction-'+i);
            buttonElement.setAttribute('numActivity',i);
            buttonElement.setAttribute('dataprofile',myJsonData);
            buttonElement.setAttribute('onclick',`applyForTransaction(this)`);
            buttonElement.setAttribute('type','submit');
            divElement.appendChild(buttonElement);
            resultElement.appendChild(divElement);
            // let pDescription = document.createElement('p');
            // pDescription.innerHTML = response.data.activities[i].description;
            // let pDuration = document.createElement('p');
            // pDuration.innerHTML = 'Duration: ' + response.data.activities[i].duration + 'hours';
            // let pSector = document.createElement('p');
            // pSector.innerHTML = 'Sector: ' + response.data.activities[i].sector;
            // let pSubSector = document.createElement('p');
            // pSubSector.innerHTML = 'Sub Sector: ' + response.data.activities[i].subsector;
            // resultElement.appendChild(pDescription);
            // resultElement.appendChild(pSector);
            // resultElement.appendChild(pSubSector);
            // resultElement.appendChild(pDuration);
          }  

      } else {
        resultElement.innerHTML = '<p>This user doesnt have any activity to offer</p>';
      }
      // resultElement.innerHTML = generateSuccessHTMLOutput(response);
    })
    .catch((error) => {
        console.log(error);
        resultElement.innerHTML = `<p>There has been an error:  ${error}</p>`;
        // resultElement.innerHTML = generateErrorHTMLOutput(error);
    });
  }

  function applyForTransaction(element) {
   
    let numActivity = element.getAttribute('numActivity');
    let attributeJSON = element.getAttribute('dataprofile');
    // console.log('les dades del array son:', dataActivities);
    console.log('el elemento JSON es:', attributeJSON);
    let dataTransaction = JSON.parse(attributeJSON);

    axios.post('http://localhost:3000/api/insertNewTransaction', dataTransaction)
    .then((response) => {
      console.log(response);
      })
    .catch( (error) => {
      console.log(error);
    });

  }


    

    // now we have to create a new transaction into BBDD

  


 