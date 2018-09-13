// var viewportHeight = $(window).height();  
// var viewportWidth = $(window).width();

// var heightNavBar = document.getElementById('navbar-main').offsetHeight;

// var heightMainTitle = viewportHeight - 2*heightNavBar;
// document.getElementById('text-banc').setAttribute("style",`height:${heightMainTitle}px`);
// document.getElementById('footer-main-page').setAttribute("style",`height:${heightNavBar}px`);


// // we force the scroll move to top when page is reload
// window.onbeforeunload = function () {
//   window.scrollTo(0, 0);
// }


$( window ).resize(() => {
  // viewportHeight = $(window).height(); 
  // heightMainTitle = viewportHeight-2*heightNavBar;
  // document.getElementById('text-banc').setAttribute("style",`height:${heightMainTitle}px`);
  // document.getElementById('footer-main-page').setAttribute("style",`height:${heightNavBar}px`);
 });


var linkLogin = document.getElementById("my-login");

// linkLogin.onclick = function(){
//   $('#myModal').modal();
//   // $('#ModalLogin').modal({
//   //   keyboard: false
//   // })
//   // $('#ModalLogin').modal('show');
//   console.log("we request for the modal");
// }

// with this funtion we force the modal in Bootstrap to submit the form. Otherwise, is not done
function loginFormSubmit() {
  document.getElementById("auth-form").submit();
}  


function openModal(){
  
  $('#ModalLogin').modal('show');
}     




