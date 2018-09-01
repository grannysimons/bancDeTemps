// import timetable from '../../timetable';
var map;
window.addEventListener('load', ()=>{
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
      filter();
    });
  }
  else
  {
    filter();
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
  console.log(`http://localhost:3000/api/filter?sector=${sector}&subsector=${subSector}&userName=${user}`)
  axios.get(`http://localhost:3000/api/filter?sector=${sector}&subsector=${subSector}&userName=${user}`)
  .then((act) => {
    document.getElementById('results').innerHTML = '';
    if(act.data.activities)
    {
      for(let i=0; i<act.data.activities.length; i++)
      {
        console.log('bu!', act.data.activities[i]);
        if(act.data.activities[i].idUser.location.length === 2 )
        {
          //marker!
          console.log('marker! ', act.data.activities[i].idUser.location);
          new mapboxgl.Marker()
          .setLngLat(act.data.activities[i].idUser.location)
          .addTo(map);
        }
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
    const idModal = '#'+e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('id');
    $(idModal).modal('hide');
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
    const idModal = '#'+e.target.parentNode.parentNode.parentNode.parentNode.getAttribute('id');
    $(idModal).modal('hide');
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

//---------------------TRANSACTION MANAGER---------------------------------------------------------------

// ----- 1) SEARCH ACTIVITIES BY USERNAME, IN ORDER TO START TRANSACTION-----------------------------
// With the following function we create a new TRANSACTION, searching for USER'S ACTIVITIES, and then , applying to start transaction

// 1.1) WHEN APPLYING SEARCH BUTTON, WE GET THE LIST OF ACTIVITIES OF THIS USER
// 1.1.a) IN performGetRequest2, we get the user_id from the USERNAME, and call the function findUserActivities(), that will retrieve all the activities of the user
function performGetRequest2() {
    var offertingUserId = undefined;
    var demandingUserId = undefined;
    var resultElement = document.getElementById('getResult2');
    var usrName = document.getElementById('usrName').value;
    resultElement.innerHTML = '';
    const sector = "";
    const subSector = "";
        
    // we need to get the user_id in order to create the transaction later
    axios.get(`http://localhost:3000/api/obtenirUserID2?userName=${usrName}`)
    .then((response) => {
      if (response.data.userid) {
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
      $("#getResult2").empty(); //we empty the activities <div>
      $("#panel-result-apply-transaction").empty();
      $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>THIS USER DOESN'T EXIST!! TRY AGAIN WITH DIFFERENT USERNAME</p>");
      $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
      
      
    });
  }  

    
// 1.1.b) With this function findUserActivities(), we get all the activities of the user.
function findUserActivities(usrName, offertingUserId) {
    const sector = "";
    const subSector = "";
    var resultElement = document.getElementById('getResult2');
    resultElement.innerHTML = '';

    axios.get(`http://localhost:3000/api/filterUserActivitiesForTransactions?userId=${offertingUserId}`)
    .then((response) => {
      $("#panel-result-apply-transaction").empty(); // We remove any previous message in the PANEL MESSAGE
      let demandingUserId = response.data.currentUser._id;
      
      if (response.data.activities.length>0 && demandingUserId!=offertingUserId) {
        for(let i=0; i<response.data.activities.length; i++)
          { 
            let dataTransaction = {
              offertingUserId: offertingUserId,
              demandingUserId: demandingUserId,
              activityId: response.data.activities[i]._id,
              status: 'Proposed',
              
            };


            // we convert it to a JSON data, and we attach to an attribute 'data-profile' in the button element
            let myJsonData = JSON.stringify(dataTransaction);
                        
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
          }  

      } else {
        if(demandingUserId==offertingUserId) {
          $("#getResult2").empty(); //we empty the activities <div>
          $("#panel-result-apply-transaction").empty();
          $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>YOU CAN'T APPLY TRANSACTION YOURSELF. PLEASE, SEARCH FOR A DIFFERENT USERNAME</p>");
          $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
        } else {
          $("#getResult2").empty(); //we empty the activities <div>
          $("#panel-result-apply-transaction").empty();
          $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>THIS USER DOESN'T HAVE ANY ACTIVITY TO OFFER. PLEASE, SELECT A DIFFERENT USERNAME</p>");
          $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
        }
        
        
      }
      
    })
    .catch((error) => {
      $("#getResult2").empty(); //we empty the activities <div>
      $("#panel-result-apply-transaction").empty();
      $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>THERE HAS BEEN AN ERROR. TRY AGAIN, PLEASE</p>");
      $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
    });
  }

  // 1.1.c) We apply for an activity of the user. So, we are accepting the transaction.
  function applyForTransaction(element) {
   
    let numActivity = element.getAttribute('numActivity');
    let attributeJSON = element.getAttribute('dataprofile');
    let dataTransaction = JSON.parse(attributeJSON);

    axios.post('http://localhost:3000/api/insertNewTransaction', dataTransaction)
    
    .then((response) => {
      $("#getResult2").empty(); //we empty the activities <div>
      $("#panel-result-apply-transaction").empty();
      $("#panel-result-apply-transaction").append("<p class='text-success border border-success apply-transaction'>THE NEW TRANSACTION HAS BEEN CREATED SUCCESFULLY!!</p>");
      $("#panel-result-apply-transaction").append('<button class="btn btn-success" onclick="clearResults(this)">Accept</button>');  
      $(window).scrollTop(0); //move the scroll at the top
    })
    .catch( (error) => {
      $("#getResult2").empty(); //we empty the activities <div>
      $("#panel-result-apply-transaction").empty();
      $("#panel-result-apply-transaction").append("<p class='text-danger border border-danger apply-transaction'>THERE HAS BEEN A PROBLEM. NEW TRANSACTION HAS NOT BEEN CREATED. TRY AGAIN, PLEASE</p>");
      $("#panel-result-apply-transaction").append('<button class="btn btn-danger" onclick="clearResults(this)">Accept</button>');  
    });
    

  }

//---------------HELPER FUNCTIONS: CLEAR <div>, REMOVE <div> USED BY DIFFERENT FUNCTIONS
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

// ----- 2) BUTTON BAR THAT ALLOWS US TO SELECT THE TRANSACTIONS BASED ON THEIR STATE-----------------------------
// With the following function we get the TRANSACTION information in each STATE

// 2.2.a) This function selectTransactionsStatus(), retrieves all TRANSACTIONS based on the STATE
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
      
      console.log('el llistat de transaccions a mostrar es',response.data.transactions);
      $('#container-title-transactions > h3').html(`${state.toUpperCase()} TRANSACTIONS`);
      $("#transaction-container").empty(); //we empty the 'transaction-container' <div>
      
      // we place a specific note about what means each type of transactions
      switch (state) {
        case 'Proposed':
          $("#transaction-container").append('<p id="description-state">"Proposed" status is the list of transactions that I have originated (triggered by me) and still pending to be accepted/rejected</p>');
          break;
        case 'Pending':
          $("#transaction-container").append('<p id="description-state">"Pending" status is the list of transactions proposed by other users, that I have to ACCEPT or REFUSE</p>');
          break;  
        case 'Accepted':
          $("#transaction-container").append('<p id="description-state">"Accepted" status is the list of transactions accepted by me</p>');
          break; 
        case 'Refused':
          $("#transaction-container").append('<p id="description-state">"Refused" status is the list of transactions refused by me</p>');
          break;  
        case 'Finished':
          $("#transaction-container").append('<p id="description-state">"Finished" status is the list of transactions where I have received the service<br>and I consider that the activity has been done</p>');
          break;
        case 'Cancelled':
          $("#transaction-container").append('<p id="description-state">"Cancelled" status is the list of transactions that were accepted by me,but which I cancelled before starting. <br>And also, transactions cancelled for demanding user requesting for my activities. </p>');
          break;              

      }
      
      
      // we fill the transactions of the chosen state
      // in response.data.transactions, this is an array with all transactions
      // Let's check in case we get 0, 1 or more
      listTransactions = response.data.transactions;
      
      
      if (listTransactions) {
        // console.log('comprovem si ens retorna un array:',Array.isArray(listTransactions));
        if (Array.isArray(listTransactions)) {
          // We look if there's any element inside
          if (listTransactions.length>0) {
          // Recorrem tot l'array de Transaccions i l'insertem al DOM
          
          listTransactions.map((element,index) => {
            
            var newdiv2 = document.createElement( "div" )


            $(newdiv2).addClass('transaction-item');
            $(newdiv2).attr('id',`transaction-item-${index}`);
            $(newdiv2).attr('data-state',`${state}`);
            $(newdiv2).attr('data-transaction',`${element._id}`);
            $(newdiv2).append(`<p class="transaction-paragraf"><span><b>Transaction #${index} ${state}</b></span></p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Description: ${ element.idActivity.description }</p>`);
            if (state==='Proposed') {
              $(newdiv2).append(`<p class="transaction-paragraf">User Service Requested: ${ element.offertingUserId.userName }</p>`);
            } else {
              $(newdiv2).append(`<p class="transaction-paragraf">User Demanding: ${ element.demandingUserId.userName }</p>`);
            }
            $(newdiv2).append(`<p class="transaction-paragraf">Sector: ${ element.idActivity.sector }</p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Subsector: ${ element.idActivity.subsector }</p>`);
            $(newdiv2).append(`<p class="transaction-paragraf">Duration: ${ element.idActivity.duration } hour</p>`);
            // console.log('el valor de newdiv2 abans',newdiv2);
            // console.log('el state abans entrar al SWITCH:',state);
            switch (state) {
              case 'Proposed':
                // We can CANCEL the transactions we have created.
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Cancelled')">Cancel</button>`);
                $(newdiv2).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
                $("#transaction-container").append( newdiv2 );
                break;
              case 'Pending':
                console.log('hem entrat a dins de pending');
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="seeListActivities(this)">See list Activities of User: ${ element.demandingUserId.userName }</button>`);
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Refused')">Reject</button>`);
                //now we have to add all the activities, and make them invisible
                $("#transaction-container").append(newdiv2);
                let itemTransactionId = `transaction-item-${index}`;
                InsertActivitiesPendingTransactions(element.demandingUserId._id,itemTransactionId);
                

                break;
              case 'Accepted':
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="seeTransactionInformation(this)">See Transaction Involved</button>`);
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Cancelled')">Cancel</button>`);
                $(newdiv2).append(`<button class="btn btn-outline-info transaction-paragraf" onclick="ChangeStatusTransaction(this,'Finished')">Finish</button>`);
                $(newdiv2).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
                $("#transaction-container").append( newdiv2 );
                break; 
              case 'Refused':
                $(newdiv2).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
                $("#transaction-container").append( newdiv2 );
                break; 
              case 'Finished':
                $(newdiv2).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
                $("#transaction-container").append( newdiv2 );
                break; 
              case 'Cancelled':
                $(newdiv2).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
                $("#transaction-container").append( newdiv2 );
                break;     

            }
            
          })
        } else {
          $('#container-title-transactions > h3').html(`${state.toUpperCase()} TRANSACTIONS`);
          $("#transaction-container").append(`<p class='text-danger border border-danger apply-transaction'>THERE'S NO TRANSACTION WITH STATUS: ${state}</p>`);
        }
      }  

      } else {
        $('#container-title-transactions > h3').html(`${state.toUpperCase()} TRANSACTIONS`);
        $('#panel-result-apply-transaction').append(`<p class='text-danger border border-danger apply-transaction'>THERE HAS BEEN ERROR. TRY AGAIN, PLEASE</p>`);

      }
     
    })
    .catch( (error) => {
      console.log('hem arribat a un error a dins de la Consulta del ESTAT');
    });


  
}

function InsertActivitiesPendingTransactions(demandingUserId,itemTransactionId) {
  axios.get(`http://localhost:3000/api/filterUserActivitiesForTransactions?userId=${demandingUserId}`)
  .then((resActivities) => {
    var newdivContainerActivities = document.createElement( "div" );
    $(newdivContainerActivities).addClass('activity-container no-visible-container');
    
    let activities2 = resActivities.data.activities;
    // console.log('comprovem si es un array:',Array.isArray(activities2));
    for(let i=0; i<activities2.length; i++) {
      
      let newdivActivity = document.createElement( "div" );
      $(newdivActivity).attr('data-activity',`${activities2[i]._id}`);
      $(newdivActivity).append(`<p class="activity-paragraf">Activity #${i}</p>`);
      $(newdivActivity).append(`<p class="activity-paragraf">Description: ${activities2[i].description}</p>`);
      $(newdivActivity).append(`<p class="activity-paragraf">Sector: ${activities2[i].sector}</p>`);
      $(newdivActivity).append(`<p class="activity-paragraf">SubSector: ${activities2[i].subsector}</p>`);
      $(newdivActivity).append(`<p class="activity-paragraf">Duration: ${activities2[i].duration}</p>`);
      $(newdivActivity).append(`<button class="btn btn-outline-info" onclick="applyForNewTransaction(this)" data-index="${i}">Apply for Activity </button>`);
      $(newdivContainerActivities).append( newdivActivity );
    }

    
    $(`#${itemTransactionId}`).append(newdivContainerActivities);
    $(`#${itemTransactionId}`).append(`<svg width=100% height="8"><line x1="40" x2=60% y1="0" y2="0" style="stroke:#567383;stroke-width:6"/></svg>`);
    
  })
  .catch( (error) => {
    
    $("#transaction-container").empty(); //we empty the itemTransaction <div> to play message an a button to accept
    $("#transaction-container").append("<p class='text-danger border border-danger apply-transaction'>THIS USER DOESN'T HAVE ACTIVITIES</p>");
    $("#transaction-container").append('<button class="btn btn-danger apply-transaction" onclick="removeParentElement(this)">Accept</button>');   
    // next(error);
  });
}

// 2.2.b) This function ChangeStatusTransaction(), is called when we click on buttons: CANCEL, REJECT, FINISH to change the STATE of the TRANSACTION in the DATABASE
function ChangeStatusTransaction(element,state) {
  // we pass as arguments the DOM Element in order to get the TransactionId, and the state we want to change
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
  }

//------------------------------------------------------------------------------------------------

 //------------------ 3. WE SEE THE TRANSACTIONS PENDING TO BE ACCEPTED FOR THE USER, THE ONE'S THAT OTHER USERS HAVE PROPOSED TO US, AND CHECK THE ACTIVITIES IN ORDER TO APPLY AND COMPLETE SECOND LEG TRANSACTION

  function seeListActivities(element) {
    let transactionElement = element.parentNode;
    let activityContainer = transactionElement.querySelector('.activity-container');
        
    if ( $(activityContainer).hasClass('no-visible-container') )
      { 
        // We want to show the list of activities
        $(activityContainer).addClass('visible-container');
        $(activityContainer).removeClass('no-visible-container');
        element.innerHTML = "Hide list of activities";
      } else {
        // we want to hide the list of activities
        $(activityContainer).addClass('no-visible-container');
        $(activityContainer).removeClass('visible-container');
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
    
    axios.get(`http://localhost:3000/api/acceptSecondLegTransaction?transactionId=${transactionId}&activityId=${activityId}`)
    .then((response) => {
      // The transaction has been applied and created. We show a SUCCESSFUL message.
      
      let myClass = $(transactionElement).attr("class"); 
      
      $(transactionElement).empty();
      $(transactionElement).append("<p class='text-success border border-success apply-transaction'>THE TRANSACTION HAS BEEN CREATED SUCCESFULLY!!</p>");
      $(transactionElement).append('<button class="btn btn-success" onclick="removeParentElement(this)">Accept</button>');  
          
    })
    .catch((error) => {
      $(ActivityContainer).empty();
      $(ActivityContainer).append("<p class='text-danger border border-danger apply-transaction'>THERE HAS BEEN A PROBLEM. THE TRANSACTION HAS NOT BEEN APPLIED. TRY AGAIN, PLEASE</p>");
      $(ActivityContainer).append('<button class="btn btn-danger" onclick="removeParentElement(this)">Accept</button>');  
    });
    
  }

    // transaction is status ACCEPTED. We want to see the other LEG of the transaction

  function seeTransactionInformation(element) {
    // based on the TransactionId, we check for this Id into transactions.idTransactionsInvolved
    let itemTransaction = element.parentNode;
    transactionId = itemTransaction.getAttribute('data-transaction');

    let activityContainer = itemTransaction.querySelector('.activity-container');
    
    
    if (activityContainer) {
      if ( $(activityContainer).hasClass('no-visible-container') )
      { 
        // We want to show the list of activities
        $(activityContainer).addClass('visible-container');
        $(activityContainer).removeClass('no-visible-container');
        element.innerHTML = "Hide Info transaction involved";
      } else {
        // we want to hide the list of activities
        $(activityContainer).addClass('no-visible-container');
        $(activityContainer).removeClass('visible-container');
        element.innerHTML = "See Info transaction involved";

      }
    } else {
      // We have to recover again the information of transaction involved
      element.innerHTML = "Hide Info transaction involved";
      axios.get(`http://localhost:3000/api/getTransactionInfoSecondLeg?transactionId=${transactionId}`)
      .then((response) => {
        let infoTransaction = response.data.transactions2[0];
        //now we have to add all the activities, and make them invisible
        let newdivContainerActivities = document.createElement( "div" );
        $(newdivContainerActivities).addClass('activity-container visible-container');
        
          let newdivActivity = document.createElement( "div" );
          $(newdivActivity).append(`<p class="activity-paragraf">Activity #1</p>`);
          $(newdivActivity).append(`<p class="activity-paragraf">Username Providing Service: ${infoTransaction.offertingUserId.userName}</p>`);
          $(newdivActivity).append(`<p class="activity-paragraf">Description: ${infoTransaction.idActivity.description}</p>`);
          $(newdivActivity).append(`<p class="activity-paragraf">Sector: ${infoTransaction.idActivity.sector}</p>`);
          $(newdivActivity).append(`<p class="activity-paragraf">SubSector: ${infoTransaction.idActivity.subsector}</p>`);
          $(newdivActivity).append(`<p class="activity-paragraf">Duration: ${infoTransaction.idActivity.duration} hours</p>`);
          $(newdivContainerActivities).append( newdivActivity );
          
          let svgElement = itemTransaction.lastChild;
          itemTransaction.insertBefore(newdivContainerActivities, itemTransaction.lastChild);
          
          
        
        // Now, we have to check the transactions state we were looking, and update it.
        // It's not necessary, because we have remove the transaction with state changed
      })
      .catch( (error) => {
        $(itemTransaction).empty(); //we empty the itemTransaction <div> to play message an a button to accept
        $(itemTransaction).append("<p class='text-danger border border-danger apply-transaction'>THERE HAS BEEN SOME TROUBLE. NO TRANSACTION ASSOCIATED. TRY AGAIN, PLEASE</p>");
        $(itemTransaction).append('<button class="btn btn-danger apply-transaction" onclick="removeParentElement(this)">Accept</button>');  
      });
    }
  }
  


    