const Activity = require('../models/activity');
const User = require('../models/user');
const mongoose = require('mongoose');

const dbName = 'timeBank';
mongoose.connect(`mongodb://localhost/${dbName}`);

const activities = [{
  sector: 'technology',
  subsector: 'web developer',
  description: 'Busco classes de programació HTML, CSS, JS',
  tags: ['html', 'css', 'js'],
  imatges: [],
  timetable: [
    {
    day: 0,
    timeSlot: 15
  },
  {
    day: 0,
    timeSlot: 16
  },
  {
    day: 0,
    timeSlot: 17
  },
  {
    day: 0,
    timeSlot: 18
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'technology',
  subsector: 'web developer',
  description: 'I offer web development for small companies or privates',
  tags: ['html', 'css', 'js', 'NodeJS', 'Express', 'Angular', 'wordpress'],
  imatges: [],
  timetable: [
    {
    day: 3,
    timeSlot: 20
  },
  {
    day: 3,
    timeSlot: 21
  },
  {
    day: 3,
    timeSlot: 22
  },
  {
    day: 3,
    timeSlot: 23
  },
  ],
  duration: 20,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'construction',
  subsector: 'plumber',
  description: 'I can fix anything at home. 20 years of experience',
  tags: ['plumber', 'water', 'tap'],
  imatges: [],
  timetable: [
    {
    day: 0,
    timeSlot: 20
  },
  {
    day: 0,
    timeSlot: 21
  },
  {
    day: 0,
    timeSlot: 22
  },
  {
    day: 2,
    timeSlot: 10
  },
  {
    day: 2,
    timeSlot: 11
  },
  {
    day: 2,
    timeSlot: 12
  },
  ],
  duration: 2,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'languages',
  subsector: 'classes',
  description: 'Ofereixo classes de català per a nouvinguts',
  tags: ['català', 'catalunya', 'nouvinguts'],
  imatges: [],
  timetable: [{
    day: 0,
    timeSlot: 20
  },
  {
    day: 0,
    timeSlot: 21
  },
  {
    day: 0,
    timeSlot: 22
  },
  {
    day: 2,
    timeSlot: 10
  },
  {
    day: 5,
    timeSlot: 11
  },
  {
    day: 5,
    timeSlot: 12
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'languages',
  subsector: 'classes',
  description: 'Ofereixo classes de castellà',
  tags: ['castellà', 'castellano', 'spanish'],
  imatges: [],
  timetable: [{
    day: 2,
    timeSlot: 15
  },
  {
    day: 2,
    timeSlot: 16
  },
  {
    day: 2,
    timeSlot: 17
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'languages',
  subsector: 'negre',
  description: 'Busco un negre per escriure la meva autobiografia',
  tags: ['català', 'negre', 'black'],
  imatges: [],
  timetable: [
    {
    day: 1,
    timeSlot: 22
  },
  {
    day: 1,
    timeSlot: 23
  },
  {
    day: 1,
    timeSlot: 24
  },
  {
    day: 1,
    timeSlot: 25
  },
  {
    day: 1,
    timeSlot: 26
  },
  {
    day: 3,
    timeSlot: 22
  },
  {
    day: 3,
    timeSlot: 23
  },
  {
    day: 3,
    timeSlot: 24
  },
  {
    day: 3,
    timeSlot: 25
  },
  {
    day: 3,
    timeSlot: 26
  },
  {
    day: 5,
    timeSlot: 22
  },
  {
    day: 5,
    timeSlot: 23
  },
  {
    day: 5,
    timeSlot: 24
  },
  {
    day: 5,
    timeSlot: 25
  },
  {
    day: 5,
    timeSlot: 26
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'languages',
  subsector: 'writer',
  description: 'Escric poemes per la teva estimada',
  tags: ['català', 'castellano', 'poesia', 'detalls'],
  imatges: [],
  timetable: [
  {
    day: 3,
    timeSlot: 22
  },
  {
    day: 3,
    timeSlot: 23
  },
  {
    day: 3,
    timeSlot: 24
  },
  {
    day: 3,
    timeSlot: 25
  },
  {
    day: 3,
    timeSlot: 26
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'services',
  subsector: 'dog walker',
  description: 'Et passejo el gos quan estiguis de vacances',
  tags: ['gos', 'passejador', 'vacances'],
  imatges: [],
  timetable: [
    {
    day: 0,
    timeSlot: 12
  },
  {
    day: 0,
    timeSlot: 13
  },
  {
    day: 1,
    timeSlot: 12
  },
  {
    day: 1,
    timeSlot: 13
  },
  {
    day: 2,
    timeSlot: 12
  },
  {
    day: 2,
    timeSlot: 13
  },
  {
    day: 3,
    timeSlot: 12
  },
  {
    day: 3,
    timeSlot: 13
  },
  {
    day: 4,
    timeSlot: 12
  },
  {
    day: 4,
    timeSlot: 13
  },
  {
    day: 5,
    timeSlot: 12
  },
  {
    day: 5,
    timeSlot: 13
  },
  {
    day: 6,
    timeSlot: 12
  },
  {
    day: 6,
    timeSlot: 13
  },
  
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'music',
  subsector: 'piano',
  description: 'Busco classes de solfeig i piano. Sóc un palurdo',
  tags: ['musica', 'piano', 'solfeig'],
  imatges: [],
  timetable: [
  {
    day: 1,
    timeSlot: 24
  },
  {
    day: 1,
    timeSlot: 25
  },
  {
    day: 3,
    timeSlot: 24
  },
  {
    day: 3,
    timeSlot: 25
  },
  {
    day: 5,
    timeSlot: 24
  },
  {
    day: 5,
    timeSlot: 25
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'mechanics',
  subsector: 'car',
  description: 'Busco qui m\'arregli el cotxe. És molt antic',
  tags: ['cotxe', 'mecànic'],
  imatges: [],
  timetable: [
  {
    day: 4,
    timeSlot: 22
  },
  {
    day: 4,
    timeSlot: 23
  },
  {
    day: 4,
    timeSlot: 24
  },
  {
    day: 4,
    timeSlot: 25
  },
  {
    day: 4,
    timeSlot: 26
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'mechanics',
  subsector: 'car',
  description: 'Arreglo cotxes. Models fins al 1924',
  tags: ['cotxe', 'mecànic'],
  imatges: [],
  timetable: [
  {
    day: 4,
    timeSlot: 22
  },
  {
    day: 4,
    timeSlot: 23
  },
  {
    day: 4,
    timeSlot: 24
  },
  {
    day: 4,
    timeSlot: 25
  },
  {
    day: 4,
    timeSlot: 26
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},
{
  sector: 'technology',
  subsector: 'web developer',
  description: 'Ofereixo classes de maquetació',
  tags: ['html', 'css', 'js'],
  imatges: [],
  timetable: [
    {
    day: 0,
    timeSlot: 15
  },
  {
    day: 0,
    timeSlot: 16
  },
  ],
  duration: 1,
  ratingAvg: 0,
  ratingActivity:[],
},];
const users = [
  {
  name: 'Joan',
  lastName: 'Salvat i Papasseit',
  userName: 'SalviPapassi',
  password: '1234',
  mail: 'papassi@iec.cat',
  direction: {
    roadType: 'avinguda',
    roadName: 'Jacint Verdaguer',
    number: 94,
    zip: '08100',
    city: 'Barcelona',
    province: 'Barcelona',
    state: 'Catalunya',
  },
  latitude: 41.40,
  longitude: 2.13,
  contactTel: '934129897',
  personalIntroducing: 'Escriptor autodidacta. Estic redactant un llibre de poemes que es dirà "la Rosa als Llavis". M\'agrada viatjar. Sento el fred de la nit i la simbomba fosca',
  image: '',
  ratingAvg: 0,
  userRatings: [],
  transactions: [],
  offertedActivities: [],
  demandedActivities: [],
},
{
  name: 'Salvador',
  lastName: 'Espriu i Castelló',
  userName: 'Uirpse',
  password: '1234',
  mail: 'espriu@anyEspriu.cat',
  direction: {
    roadType: 'carrer',
    roadName: 'Sagarra',
    number: 12,
    zip: '08890',
    city: 'Arenys de Mar',
    province: 'Barcelona',
    state: 'Catalunya',
  },
  latitude: 41.58,
  longitude: 2.54,
  contactTel: '932913415',
  personalIntroducing: 'Sóc un friki dels poemes. M\'agrada molt escriure i tinc uns quants poemaris. Sóc activista contra l\'imperialisme de Safarad. Quan mori, enterreu-me al cementiri de Sinera',
  image: '',
  ratingAvg: 0,
  userRatings: [],
  transactions: [],
  offertedActivities: [],
  demandedActivities: [],
},
{
  name: 'Josep',
  lastName: 'Pla i Casadevall',
  userName: 'Pepo',
  password: '1234',
  mail: 'pepo@ministerios.es',
  direction: {
    roadType: 'avinguda',
    roadName: 'Generalísimo',
    number: 36,
    zip: '08380',
    city: 'Palafrugell',
    province: 'Girona',
    state: 'España',
  },
  latitude: 41.92,
  longitude: 3.16,
  contactTel: '972790325',
  personalIntroducing: 'Sóc escriptor i persiodista. Una mica fatxilla. Sóc una persona conservadora i molt de costums.',
  image: '',
  ratingAvg: 0,
  userRatings: [],
  transactions: [],
  offertedActivities: [],
  demandedActivities: [],
},
{
  name: 'Joan',
  lastName: 'Olivé i Sallarès',
  userName: 'pereIV',
  password: '1234',
  mail: 'pereiv@gmail.com',
  direction: {
    roadType: 'carrer',
    roadName: 'Lacy',
    number: 11,
    zip: '08202',
    city: 'Sabadell',
    province: 'Barcelona',
    state: 'Catalunya',
  },
  latitude: 41.54,
  longitude: 2.11,
  contactTel: '937453248',
  personalIntroducing: 'Encara que vinc d\'una important família burgesa sabadellenca, he participat en la lluita antifeixista i faré perquè tothom tingui accés a la cultura. Estimo la meva terra: En ma terra del Vallès, tres turons fan una serra, quatre pins un bosc espès i cinc quarteres massa terra. Com el Vallès no hi ha res!',
  image: '',
  ratingAvg: 0,
  userRatings: [],
  transactions: [],
  offertedActivities: [],
  demandedActivities: [],
}];

function updateObject(idUserConsumer, ratingServer, reviewServer, idUserServer, ratingConsumer, reviewConsumer, ratingAvg)
{
    return {
      ratingActivity:
      [
        {
          userServer:
          {
            idUserConsumer: idUserConsumer,
            rating: ratingServer,
            review: reviewServer,
          },
          userConsumer:
          {
            idUserServer: idUserServer,
            rating: ratingConsumer,
            review: reviewConsumer,
          }
        }
      ], 
      ratingAvg: ratingAvg,
    }
}

let retrievedActivities = [];
Activity.create(activities)
.then(createdActivities => {
  users[1].demandedActivities.push(createdActivities[0]._id);
  users[1].offertedActivities.push(createdActivities[1]._id);
  users[1].offertedActivities.push(createdActivities[9]._id);
  users[2].offertedActivities.push(createdActivities[2]._id);
  users[2].offertedActivities.push(createdActivities[3]._id);
  users[2].offertedActivities.push(createdActivities[4]._id);
  users[2].demandedActivities.push(createdActivities[5]._id);
  users[3].offertedActivities.push(createdActivities[6]._id);
  users[3].offertedActivities.push(createdActivities[7]._id);
  users[3].offertedActivities.push(createdActivities[10]._id); //activitats 0-10 -> servidor:3 - consumidor:1 //pending
  users[1].transactions.involvedUserId=users[3]._id;
  users[1].transactions.state='Proposed';
  users[1].idActivity = createdActivities[0]._id;
  users[3].demandedActivities.push(createdActivities[8]._id); //activitats 8-9 -> servidor:1 - consumidor:3 //Finished
  users[3].transactions.involvedUserId=users[1]._id;
  users[3].transactions.state='Finished';
  users[3].idActivity = createdActivities[8]._id;
  users[1].transactions.involvedUserId=users[3]._id;
  users[1].transactions.state='Finished';
  users[1].idActivity = createdActivities[9]._id;
  users[1].userRatings.push({userId: users[3]._id, rating: 8, review: 'persona molt seriosa'});
  users[1].userRatings.push({userId: users[3]._id, rating: 9, review: 'un plaer fer intercanvis amb aquest usuari'});
  users[1].ratingAvg = 8.5;
  users[3].userRatings.push({userId: users[1]._id, rating: 5, review: 'poc puntual'});
  users[3].userRatings.push({userId: users[1]._id, rating: 8, review: 's\'ha posat les piles i ha millorat respecte les últimes activitats intercanviades'});
  users[3].ratingAvg = 6.5;
  retrievedActivities = Object.assign(createdActivities, {});
})
.then(()=>{
  User.create(users)
  .then(createdUsers => {
    const Promise1 = new Promise((resolve, reject) => {
      Activity.update({_id: retrievedActivities[0]._id}, updateObject(createdUsers[1]._id, 8, 'és un crac!', createdUsers[3]._id, 9, 'molt bon usuari', 8))
      .then((updatedActivity)=>{
        resolve(updatedActivity);
      })
      .catch(err => reject(err))
    });
    const Promise2 = new Promise((resolve, reject) => {
      Activity.update({_id: retrievedActivities[10]._id}, updateObject(createdUsers[1]._id, 8, 'és un crac!', createdUsers[3]._id, 9, 'molt bon usuari', 8))
      .then((updatedActivity)=>{
        resolve(updatedActivity);
      })
      .catch(err => reject(err))
    });
    const Promise3 = new Promise((resolve, reject) => {
      Activity.update({_id: retrievedActivities[8]._id}, updateObject(createdUsers[3]._id, 6, 'podria millorar', createdUsers[1]._id, 10, 'amb gent així dona gust', 6))
      .then((updatedActivity)=>{
        resolve(updatedActivity);
      })
      .catch(err => reject(err))
    });
    const Promise4 = new Promise((resolve, reject) => {
      Activity.update({_id: retrievedActivities[9]._id}, updateObject(createdUsers[3]._id, 6, 'podria millorar', createdUsers[1]._id, 10, 'amb gent així dona gust', 6))
      .then((updatedActivity)=>{
        resolve(updatedActivity);
      })
      .catch(err => reject(err))
    });

    Promise.all([ Promise1, Promise2, Promise3, Promise4])
    .then(()=>{
      console.log('correctly created users and activities');
      mongoose.connection.close();
    })
  })
})
.catch(error => console.log('error creating users and activities in the database', error));