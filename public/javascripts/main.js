// import timetable from '../../timetable';
var map;
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

  mapboxgl.accessToken = 'pk.eyJ1IjoibWFyaW9uYXJvY2EiLCJhIjoiY2prYTFlMHhuMjVlaTNrbWV6M3QycHlxMiJ9.MZnaxVqaxmF5fMrxlgTvlw';
  
  if(navigator.geolocation)
  {
    navigator.geolocation.getCurrentPosition(position => {
      const point = [position.coords.longitude, position.coords.latitude];
      map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/streets-v10',
          zoom: 15,
          center: point
      });
    });
  }
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
    document.getElementById('results').innerHTML = '';
    if(act.data.activities)
    {
      for(let i=0; i<act.data.activities.length; i++)
      {
        let liElement = document.createElement('li');
        liElement.classList.add('row');
        document.getElementById('results').appendChild(liElement);
        let divLeft = document.createElement('div');
        divLeft.classList.add('col-sm-7');
        liElement.appendChild(divLeft);
  
        let divDescription = document.createElement('div');
        divDescription.innerHTML = act.data.activities[i].description;
        let divDuration = document.createElement('div');
        divDuration.innerHTML = 'duration: ' + act.data.activities[i].duration + ' hours';
        divLeft.appendChild(divDescription);
        divLeft.appendChild(divDuration);
        
        let divRight = document.createElement('div');
        divRight.classList.add('col-sm-5', 'right-container');
        liElement.appendChild(divRight);
  
        let buttonMoreInfo = document.createElement('button');
        buttonMoreInfo.setAttribute('type', 'button');
        buttonMoreInfo.classList.add('btn', 'btn-outline-info');
        buttonMoreInfo.setAttribute('data-toggle', 'modal');
        buttonMoreInfo.setAttribute('data-target', '#activity'+i);
        buttonMoreInfo.innerHTML = 'More info';
        divRight.appendChild(buttonMoreInfo);
  
        let modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.setAttribute('id', 'activity'+i);
        modal.setAttribute('tabindex', '-1');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'exampleModalCenterTitle');
        modal.setAttribute('aria-hidden', 'true');
        liElement.appendChild(modal);
  
        let innerModal = document.createElement('div');
        innerModal.classList.add('modal-dialog', 'modal-dialog-centered');
        innerModal.setAttribute('role', 'document');
        modal.appendChild(innerModal);
  
        let modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
  
        modalContent.innerHTML = 
        `<div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">More info</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <ul>
            <li>sector/subsector: ${act.data.activities[i].sector} / ${act.data.activities[i].subsector}</li>
            <li>user: ${act.data.activities[i].idUser.userName} </li>
            <li class="description"> ${act.data.activities[i].description} </li>
            <li>tags: ${act.data.activities[i].tags} </li>
          </ul>
        </div>`;
        innerModal.appendChild(modalContent);
    
        
        if(act.data.currentUser) 
        {
          let dynamicClass = 'apply-'+act.data.activities[i]._id;
  
          let modalFooter = document.createElement('div');
          modalFooter.classList.add('modal-footer');
          modalContent.appendChild(modalFooter);
          let buttonApplyModal = document.createElement('button');
          buttonApplyModal.setAttribute('type', 'button');
          buttonApplyModal.classList.add('btn', 'btn-outline-info', dynamicClass);
          buttonApplyModal.innerHTML = 'Apply';
          buttonApplyModal.addEventListener('click', apply);
          modalFooter.appendChild(buttonApplyModal);
  
          let buttonApply = document.createElement('button');
          buttonApply.classList.add('btn', 'btn-outline-info', dynamicClass);
          buttonApply.setAttribute('id', 'apply-'+i);
          buttonApply.addEventListener('click', apply);
          buttonApply.innerHTML = 'Apply';
  
          divRight.appendChild(buttonApply);
        }
      }
    }
    else
    {
      document.getElementById('results').innerHTML = 'No results to show';
    }
  })
  .catch(error => {
    document.getElementById('results').innerHTML = "Error " + error;
  })
} 

function apply(e){
  const idActivitat = e.target.classList[2].substring(6);
  console.log(`http://localhost:3000/api/${idActivitat}/request`);
  axios.get(`http://localhost:3000/api/${idActivitat}/request`)
  .then(act => {
    if (act.data.message === 'ok')
    {
      const message = `<div class="alert alert-success" role="alert">
        Correctly started transation. You must wait until the other user accepts
      </div>`;
      document.getElementById('results').innerHTML = message;
    }
    else
    {
      document.getElementById('results').innerHTML = "Error " + act.data.message;
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
            buttonElement.classList.add('btn', 'btn-outline-info');
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

  function seeListActivities(element) {
    // let visibleStatus = element.getAttribute('data-status');
    let transactionElement = element.parentNode;
    let activityContainer = transactionElement.querySelector('.activity-container');
    // console.log('el estado de vista de actividades es',visibleStatus);
    
    if ( $(activityContainer).hasClass('no-visible-container') )
      { 
        // We want to show the list of activities
        $(activityContainer).addClass('visible-container');
        $(activityContainer).removeClass('no-visible-container');
      // element.setAttribute('data-status','visible');
        element.innerHTML = "Hide list of activities";
      } else {
        // we want to hide the list of activities
        $(activityContainer).addClass('no-visible-container');
        $(activityContainer).removeClass('visible-container');
      // element.setAttribute('data-status','visible');
        element.innerHTML = "See list of activities";

      }

  }
  
  // we have been demanded for a service we offer, and we choose an activity offered by the user
  function applyForNewTransaction(element) {
    let ActivityElement = element.parentNode;
    let ActivityContainer = ActivityElement.parentNode;
    let transactionElement = ActivityContainer.parentNode;

    // we need the _id of activity
    let activityId = ActivityElement.getAttribute('data-activity');
    let transactionId = transactionElement.getAttribute('data-transaction');
    
    console.log('el _id de activitat es:',activityId);
    console.log('el _id de transaction es:',transactionId);

    axios.get(`http://localhost:3000/api/acceptSecondLegTransaction?transactionId=${transactionId}&activityId=${activityId}`)
    .then((response) => {
      console.log('aquesta es la resposta:',response);
          
    })
    .catch((error) => {
      console.log(error);
      alert('there has been an error', error);
      // resultElement.innerHTML = generateErrorHTMLOutput(error);
    });
    
  }

    // now we have to create a new transaction into BBDD

  


    