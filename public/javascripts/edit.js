// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocodingClient = mbxGeocoding({ accessToken: 'pk.eyJ1IjoibWFyaW9uYXJvY2EiLCJhIjoiY2prYTFlMHhuMjVlaTNrbWV6M3QycHlxMiJ9.MZnaxVqaxmF5fMrxlgTvlw' });

// window.addEventListener('load', ()=>{
//   console.log('1');
//   document.querySelector('#editProfileButton').addEventListener('click', geocoding);
//   console.log('2');
// });

// function geocoding(){
//   console.log('geocoding');
//   const roadType = document.getElementById("roadType").value;
//   const roadName = document.getElementById("roadName").value;
//   const number = document.getElementById("number").value;
//   const zipCode = document.getElementById("zipCode").value;
//   const city = document.getElementById("city").value;
//   const province = document.getElementById("province").value;
//   const state = document.getElementById("state").value;
//   const query = roadType + ' ' + roadName + ' ' + number + ', ' + zipCode + ' ' + city + ', ' + province + ', ' + state;

//   geocodingClient.forwardGeocode({
//     query: query,
//     limit: 2
//   })
//   .send()
//   .then(response => {
//     const match = response.body;
//   });

//   // axios.get(`/geocoding/v5/mapbox.places/${query}.json`)
//   // .then(location => {
//   //   console.log('location ', location);
//   // })
//   // .catch(error => {
//   //   console.log('error: ', error);
//   // })
// }