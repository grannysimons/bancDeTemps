# Project Name

## Description

Time banck where users give and consume activities with no money transfer
 
 ## User Stories

List of user stories in order of priority/importance.

User profile:
- register and create profile
- login
- CRUD offerted activities
- CRUD demanded activities

Search activities:
- Show all activities from any user.
- Filter activities by sector/subsector and/or by rate

##views

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about, login, logout, signup and use the main activity filter. Login and logout with bootstrap modals.
- **sign up** - As a user I want to sign up on the webpage so that I can apply any activity I want
- **editar perfil** - As a user, I want to edit my profile
- **offerted/demanded activities** - As a user I want to have listed my oferted/demanded activities
- **pending/finished transactions** - As a user I want to have listed my pending/finished transactions

## Backlog

- filter by proximity to the user location
- rate (rating and reviews) users considering a single executed activity.
- live suggestions in address form fields: province->city->streets
- see all activities in a map
- paginate search results
- when the map center changes should update users view in it.
- user profile and activities with images (fileUpload package)
- mail notifications (nodemailer)
- when a map marker is selected, basic info and a "fast application" button will appear in a pop up over it.
- Notifications: accept requests, rate, private message notifications, ... (socket.io)
- xat (socket.io)
- When an activity is selected, select the timetable that best fits to user preferences
- Receive activity suggestions from the app by proximity, user rating, sector/subsector of already selected activities.
- search results by percentage of affinity by coincidence of description and tags


## ROUTES:

```
GET / - Homepage
GET /signup - Formulari d'alta amb activitats ofertades i demandades. Action = "/"
POST / - Body: Nom, Cognoms, Nom d'usuari, Password, Mail, Direcció, Telèfon de contacte, Presentació personal, Imatge, Activitats ofertades, Activitats demandades
GET /profile/edit - Formulari de modificació del perfil
GET /profile/activities - Llista d'activitats (veure, editar i eliminar activitats amb modals)
GET /profile/transactions - Llista de transaccions (acceptar pendents i valorar finalitzades)
GET /api/:idAct/request

//Mariona:
POST /api/filter - Body: Sector, subsector, distància
POST /api/pagination_right
POST /api/pagination_left
```

## MODELS

USER:

```
Id: ObjectId
name: String
lastName: String
userName: String
password: String
mail: String
direction: {
  type: String,
  name: String,
  number: Number,
  zip: String,
  city: String,
  province: String,
  state: String,
}
latitude: Number
longitude: Number
contactTel: String
personalIntroducing: String
image: String
ratingAvg: Number
userRatings: [{
  userId: String,
  rating: Number,
  review: String
}]
transactions: [{
  involvedUserId: String,
  state: {
    state: String,
    enum: ['Proposat', 'Acceptat', 'Rebutjat', 'Cancelat', 'Finalitzat']
  },
  idActivitat: String
}]
offertedActivities: [{
  type: ObjectId, 
  ref: 'Activity',
}]
demandedActivities: [{
  type: ObjectId, 
  ref: 'Activity',
}]
```

ACTIVITY

```
id: ObjectId
sector: String
subsector: String
description: String
tags: [String]
imatges: [String]
timetable: [{
  day: {
    type: Number,
    enum: [0, 1, 2, 3, 4, 5, 6]
  },
  timeSlot: {
    type: Number,
    enum: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47]
  }
}]
duration: Number
ratingAvg: Number
ratingActivity:[{
  userServer:{
    idUserConsummer: ObjectId,
    rating: Number,
    review: String
  },
  userConsumer:{
    idUserServer: ObjectId,
    rating: Number,
    review: String
  }
}]
```

## Links

### Trello

https://trello.com/b/zRpitrHz/banc-de-temps

### Git

The url to your repository and to your deployed project

https://github.com/grannysimons/bancDeTemps

[Deploy Link](http://heroku.com)

### Slides.com

The url to your presentation slides

[Slides Link](http://slides.com)