const Activity = require('../models/activity');
const User = require('../models/user');
const Transaction = require('../models/transactions');
const mongoose = require('mongoose');

const dbName = 'timeBank';
mongoose.connect(`mongodb://localhost/${dbName}`);

const activities = [{
  sector: 'technology',
  subsector: 'web developer',
  description: 'Busco classes de programació HTML, CSS, JS',
  tags: ['html', 'css', 'js'],
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
},
{
  sector: 'construction',
  subsector: 'plumber',
  description: 'I can fix anything at home. 20 years of experience',
  tags: ['plumber', 'water', 'tap'],
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
},
{
  sector: 'languages',
  subsector: 'classes',
  description: 'Ofereixo classes de català per a nouvinguts',
  tags: ['català', 'catalunya', 'nouvinguts'],
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
},
{
  sector: 'languages',
  subsector: 'classes',
  description: 'Ofereixo classes de castellà',
  tags: ['castellà', 'castellano', 'spanish'],
  timetable: [
  {
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
},
{
  sector: 'languages',
  subsector: 'negre',
  description: 'Busco un negre per escriure la meva autobiografia',
  tags: ['català', 'negre', 'black'],
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
},
{
  sector: 'languages',
  subsector: 'writer',
  description: 'Escric poemes per la teva estimada',
  tags: ['català', 'castellano', 'poesia', 'detalls'],
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
},
{
  sector: 'services',
  subsector: 'dog walker',
  description: 'Et passejo el gos quan estiguis de vacances',
  tags: ['gos', 'passejador', 'vacances'],
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
},
{
  sector: 'music',
  subsector: 'piano',
  description: 'Busco classes de solfeig i piano. Sóc un palurdo',
  tags: ['musica', 'piano', 'solfeig'],
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
},
{
  sector: 'mechanics',
  subsector: 'car',
  description: 'Busco qui m\'arregli el cotxe. És molt antic',
  tags: ['cotxe', 'mecànic'],
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
},
{
  sector: 'mechanics',
  subsector: 'car',
  description: 'Arreglo cotxes. Models fins al 1924',
  tags: ['cotxe', 'mecànic'],
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
},
{
  sector: 'technology',
  subsector: 'web developer',
  description: 'Ofereixo classes de maquetació',
  tags: ['html', 'css', 'js'],
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
}];
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
  telephone: '934129897',
  introducing: 'Escriptor autodidacta. Estic redactant un llibre de poemes que es dirà "la Rosa als Llavis". M\'agrada viatjar. Sento el fred de la nit i la simbomba fosca',
  demandedActivities: [],
  offertedActivities: []
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
  telephone: '932913415',
  introducing: 'Sóc un friki dels poemes. M\'agrada molt escriure i tinc uns quants poemaris. Sóc activista contra l\'imperialisme de Safarad. Quan mori, enterreu-me al cementiri de Sinera',
  demandedActivities: [],
  offertedActivities: []
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
  telephone: '972790325',
  introducing: 'Sóc escriptor i persiodista. Una mica fatxilla. Sóc una persona conservadora i molt de costums.',
  demandedActivities: [],
  offertedActivities: []
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
  telephone: '937453248',
  introducing: 'Encara que vinc d\'una important família burgesa sabadellenca, he participat en la lluita antifeixista i faré perquè tothom tingui accés a la cultura. Estimo la meva terra: En ma terra del Vallès, tres turons fan una serra, quatre pins un bosc espès i cinc quarteres massa terra. Com el Vallès no hi ha res!',
  demandedActivities: [],
  offertedActivities: []
}];

var retrievedActivities = undefined;

Activity.create(activities)
.then(createdActivities => {
  retrievedActivities = Object.assign({}, createdActivities);

  users[1].demandedActivities.push(createdActivities[0]._id);
  users[1].offertedActivities.push(createdActivities[1]._id);
  users[1].offertedActivities.push(createdActivities[9]._id);
  users[2].offertedActivities.push(createdActivities[2]._id);
  users[2].offertedActivities.push(createdActivities[3]._id);
  users[2].offertedActivities.push(createdActivities[4]._id);
  users[2].demandedActivities.push(createdActivities[5]._id);
  users[3].offertedActivities.push(createdActivities[6]._id);
  users[3].offertedActivities.push(createdActivities[7]._id);
  users[3].offertedActivities.push(createdActivities[10]._id);
  users[3].demandedActivities.push(createdActivities[8]._id);

  return User.create(users)
})
.then((createdUsers)=>{
  const transactions = [
    {
      idActivity: [0]._id,
      offertingUserId: createdUsers[3]._id,
      demandingUserId: createdUsers[1]._id,
      state: 'Proposed',
    },
    {
      idActivity: retrievedActivities[8]._id,
      offertingUserId: createdUsers[1]._id,
      demandingUserId: createdUsers[3]._id,
      state: 'Finished',
    },
  ];
  return Transaction.create(transactions)
})
.then(() => {
  console.log('correctly created users, activities and transactions');
  mongoose.connection.close();
})
.catch(error => console.log('error creating users and activities in the database', error));