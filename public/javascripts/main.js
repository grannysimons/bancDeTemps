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

// With the following function we create a new TRANSACTION, searching for USER'S ACTIVITIES, and then , applying to start transaction
  
function performGetRequest2() {
    var offertingUserId = undefined;
    var demandingUserId = undefined;
    var resultElement = document.getElementById('getResult2');
    var usrName = document.getElementById('usrName').value;
    resultElement.innerHTML = '';
    const sector = "";
    const subSector = "";
    
    
    // console.log('el valor de demanding user es:',demandingUserId);
    // console.log('estem dins de AXIOS');
    // we need to get the user_id in order to create the transaction later
    axios.get(`http://localhost:3000/obtenirUserID?userName=${usrName}`)
    .then((response) => {
      console.log('3.aquesta es la resposta de obtenir el USERID:',response);
      console.log('4.el valor de userid es:',response.data.userid);
      if (response.data.userid) {
        console.log('5.hem entrat dins el if i per tant hem obtingut el offertingUserId');
        offertingUserId = response.data.userid;
        // Now that we have retrieve the OfferingUserId, we can ask for activities of this user
        findUserActivities(usrName, offertingUserId);
      } else {
        //This user doesn't exist, so we place a message
        $("#getResult2").empty(); //we empty the activities <div>
        $("#panel-result-apply-transaction").empty();
        $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>THIS USER DOESN'T EXIST!! TRY AGAIN WITH DIFFERENT USERNAME</p>");
        $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
      }
    })
    .catch((error) => {
      // console.log(error);
      $("#getResult2").empty(); //we empty the activities <div>
      $("#panel-result-apply-transaction").empty();
      $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>THIS USER DOESN'T EXIST!! TRY AGAIN WITH DIFFERENT USERNAME</p>");
      $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
      // resultElement.innerHTML = `<p>There has been an error:  ${error}. Try again</p>`;
      
    });
  }  

    

function findUserActivities(usrName, offertingUserId) {
    const sector = "";
    const subSector = "";
    var resultElement = document.getElementById('getResult2');
    resultElement.innerHTML = '';

    axios.get(`http://localhost:3000/api/filterUserActivities?sector=${sector}&subsector=${subSector}&userName=${usrName}`)
    .then((response) => {
      console.log('aquesta es la resposta:',response);
      if (response.data.activities.length>0) {
        demandingUserId = response.data.currentUser._id;
        // var activitiesArray = response.data.activities;
        // resultElement.innerHTML = '<p>This user has activities to offer</p>';
        console.log('el valor de offertingUserId abans de crear el JSON es',offertingUserId);
        for(let i=0; i<response.data.activities.length; i++)
          { 
            let dataTransaction = {
              offertingUserId: offertingUserId,
              demandingUserId: demandingUserId,
              activityId: response.data.activities[i]._id,
              status: 'Proposed',
              // idTransactionsInvolved: ''
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
      console.log('anem a borrar les activitats i imprimir el missatge');
      $("#getResult2").empty(); //we empty the activities <div>
      $("#panel-result-apply-transaction").empty();
      $("#panel-result-apply-transaction").append("<p class='text-success border border-success apply-transaction'>THE NEW TRANSACTION HAS BEEN CREATED SUCCESFULLY!!</p>");
      $("#panel-result-apply-transaction").append('<button class="btn btn-success" onclick="clearResults(this)">Accept</button>');  
      // $(window).animate({ scrollTop: 0 }, 'slow'); //per comptes de $(window), podem posar qualsevol element i farà el scroll fins a aquell element 
      $(window).scrollTop(0); //move the scroll at the top
    })
    .catch( (error) => {
      console.log(error);
      console.log('DE RETON DE AXIOS HEM TINGUT UN ERROR');
    });
    console.log('HEM TORNAT DE AXIOS, PER VEURE QUE ENS RETORNA');

  }

// Clear Results: clear results from the content of <div> parent

function clearResults(element) {
  let panelElement = element.parentNode;
  $(panelElement).empty();
}

function removeParentElement(element) {
  let panelElement = element.parentNode;
  $(panelElement).remove();
}

function clearActivities() {
  // we clear all information in SEARCH USER FOR TRANSACTION section
  // we clear: 1) input username, 2) panel message result, 3) list of activities
  $("#getResult2").empty(); //we empty the activities <div>
  $("#panel-result-apply-transaction").empty();
  $("#usrName").val('');
}

function selectTransactionsStatus(element) {
  // $(element).siblings().toggleClass('btn-info')
  // We change the class of current BUTTON
  $(element).addClass('btn-info');
  $(element).removeClass('btn-warning');
  let state = element.getAttribute('data-status');

  // we setup the Classes of Siblings
  $(element).siblings().addClass('btn-warning');
  $(element).siblings().removeClass('btn-info');

  axios.get(`http://localhost:3000/api/getTransactionsOnState?state=${state}`)
    
    .then((response) => {
      console.log(response);
      // console.log('anem a borrar les activitats i imprimir el missatge');
      $("#transaction-container").empty(); //we empty the 'transaction-container' <div>
      
      // we fill the transactions of the chosen state
      // in response.data.transactions, this is an array with all transactions
      // Let's check in case we get 0, 1 or more
      listTransactions = response.data.transactions;
      
      if (listTransactions) {
        if (Array.isArray(listTransactions)) {
          // We look if there's any element inside
          if (listTransactions.length>0) {
          // Recorrem tot l'array de Transaccions i l'insertem al DOM
          
          listTransactions.map((element,index) => {
            let newdiv2 = document.createElement( "div" )
            // let itemTransaction = $("#transaction-container").append( newdiv2 );
            $(newdiv2).addClass('transaction-item');
            $(newdiv2).attr('data-state',`${state}`);
            $(newdiv2).attr('data-transaction',`${element._id}`);
            $(newdiv2).append(`<p class="transaction-paragraf"><span><b>Transaction #${index} ${state}</b></span></p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Description: ${ element.idActivity.description }</p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">User Demanding: ${ element.demandingUserId.userName }</p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Sector: ${ element.idActivity.sector }</p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Subsector: ${ element.idActivity.subsector }</p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Duration: ${ element.idActivity.duration } hour</p>`);
            
            switch (state) {
              case 'Proposed':
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="seeListActivities(this)">See list Activities of User: ${ element.demandingUserId.userName }</button>`);
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Refused')">Reject</button>`);
                //now we have to add all the activities, and make them invisible
                let newdivContainerActivities = document.createElement( "div" );
                $(newdivContainerActivities).addClass('activity-container no-visible-container');
                for(let i=0; i<element.demandingUserId.offertedActivities.length; i++) {
                  let newdivActivity = document.createElement( "div" );
                  $(newdivActivity).attr('data-activity',`${element.demandingUserId.offertedActivities[i]._id}`);
                  $(newdivActivity).append(`<p class="activity-paragraf">Activity #${i}</p>`);
                  $(newdivActivity).append(`<p class="activity-paragraf">Description: ${element.demandingUserId.offertedActivities[i].description}</p>`);
                  $(newdivActivity).append(`<p class="activity-paragraf">Sector: ${element.demandingUserId.offertedActivities[i].sector}</p>`);
                  $(newdivActivity).append(`<p class="activity-paragraf">SubSector: ${element.demandingUserId.offertedActivities[i].subsector}</p>`);
                  $(newdivActivity).append(`<p class="activity-paragraf">Duration: ${element.demandingUserId.offertedActivities[i].duration}</p>`);
                  $(newdivActivity).append(`<button class="btn btn-outline-info" onclick="applyForNewTransaction(this)" data-index="${i}">Apply for Activity </button>`);
                  $(newdivContainerActivities).append( newdivActivity );
                }
                $(newdiv2).append( newdivContainerActivities );
                break;
              case 'Accepted':
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="seeTransactionInformation(this)">See Transaction Involved</button>`);
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Cancelled')">Cancel</button>`);
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Finished')">Finish</button>`);
                break; 

            }

            
            $(newdiv2).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
            $("#transaction-container").append( newdiv2 );
          })
        } else {
          $("#transaction-container").append(`<p class='text-danger border border-danger apply-transaction'>THERE'S NO TRANSACTION WITH STATUS: ${state}</p>`);
        }
      }  

      } else {
        $('#panel-result-apply-transaction').append(`<p class='text-danger border border-danger apply-transaction'>THERE HAS BEEN ERROR. TRY AGAIN, PLEASE</p>`);

      }


      // $(window).animate({ scrollTop: 0 }, 'slow'); //per comptes de $(window), podem posar qualsevol element i farà el scroll fins a aquell element 
      // $(window).scrollTop(0); //move the scroll at the top
    })
    .catch( (error) => {
      console.log(error);
      console.log('DE RETON DE AXIOS HEM TINGUT UN ERROR');
    });


  
}

function ChangeStatusTransaction(element,state) {
  let itemTransaction = element.parentNode;
  transactionId = itemTransaction.getAttribute('data-transaction');

  axios.get(`http://localhost:3000/api/updateStateTransaction?state=${state}&transactionId=${transactionId}`)
  .then((response) => {
    //we have successfully update the state of transaction. Let's show a message
    $(itemTransaction).empty(); //we empty the itemTransaction <div> to play message an a button to accept
    $(itemTransaction).append("<p class='text-success border border-success apply-transaction'>THE STATE OF THE TRANSACTION HAS CHANGED SUCCESFULLY!!</p>");
    $(itemTransaction).append('<button class="btn btn-success" onclick="removeParentElement(this)">Accept</button>');  
    
    // Now, we have to check the transactions state we were looking, and update it.
    // It's not necessary, because we have remove the transaction with state changed
  })
  .catch( (error) => {
    $(itemTransaction).empty(); //we empty the itemTransaction <div> to play message an a button to accept
    $(itemTransaction).append("<p class='text-danger border border-danger apply-transaction'>THE HAS BEEN SOME TROUBLE. THE STATE OF THE TRANSACTION HAS NOT BEEN CHANGED. TRY AGAIN, PLEASE</p>");
    $(itemTransaction).append('<button class="btn btn-danger apply-transaction" onclick="removeParentElement(this)">Accept</button>');  
  });
  
  // Let's check the status we want to update it

//   switch(state) {
//     case x:
//         code block
//         break;
//     case y:
//         code block
//         break;
//     default:
//         code block
// }

}

//------------------------------------------------------------------------------------------------

 // 3. WE SEE THE TRANSACTIONS PROPOSED, THE ONE'S THAT OTHER USERS HAVE PROPOSED TO US, AND CHECK THE ACTIVITIES IN ORDER TO APPLY AND COMPLETE SECOND LEG TRANSACTION

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
      // console.log('aquesta es la resposta:',response);
          
    })
    .catch((error) => {
      console.log(error);
      alert('there has been an error', error);
      // resultElement.innerHTML = generateErrorHTMLOutput(error);
    });
    
  }

    // now we have to create a new transaction into BBDD

  


    