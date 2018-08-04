# Project Name

## Description

Banco de tiempo donde usuarios proponen y reciben actividades sin transacciones monetarias
 
 ## User Stories

List of user stories in order of priority/importance.

Example:

User profile:
 - Registrar-se i crear el perfil
 - Fer login
 - Crear/editar/eliminar activitats ofertades
 - Crear/editar/eliminar activitats demandades

Search activities:
 - Veure totes les activitats de qualsevol usuari
 - Filtrar activitats per tipus d'activitat (sector/subsector), per top-rated

##views

 - **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault 
 - **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault
 - **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup
 - **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend
 - **login** - Modal in the homepage
 - **logout** - Button in the homepage
 - **editar perfil** - As a user, I want to edit my profile
 - **activitats ofertades/demandades** - As a user I want to have listed my oferted/requested activities
 - **transaccions realitzades/pendents** - As a user I want to have listed my pending/finished activies

## Backlog

- filtrar per proximitat
- Fer valoracions (puntuació sobre 5 i comentaris) a usuaris a partir d'una activitat concreta contractada.
- suggeriments als formularis per direccions-provincies-poblacions -> BBDD externes consultables amb una api? preguntar a Thor!!!!!!
- Veure les activitats en un mapa.
- Paginació de resultats de cerques.
- Quan canvii el centre del mapa, que s'actualitzin els usuaris que s'hi visualitzin
- perfil d'usuari amb imatge i activitats amb imatges -> paquet Fileupload (farem una classe!)
- mails de notificació: nodemailer
- quan es seleccioni un marcador del mapa, que aparegui un popup amb la info bàsica i un botó de "application" ràpida.
- Notificacions: acceptar peticions, fer ratings, avis de missatge privat...
- xat -> buscar algun paquet que ho faci ?
- Quan es selecciona una activitat, seleccionar la franja horaria que a l'usuari li vagi millor
- Rebre suggeriments de la aplicació per proximitat, rating d'usuari i tipus d'activitats ja utilitzades
- Resultat de cerques per % d'afinitat per coincidència de DESCRIPCIÓ i TAGS.

```

## ROUTES:

```
GET / - Homepage
GET /signup - Formulari d'alta amb activitats ofertades i demandades. Action = "/"
POST / - Body: Nom, Cognoms, Nom d'usuari, Password, Mail, Direcció, Telèfon de contacte, Presentació personal, Imatge, Activitats ofertades, Activitats demandades
GET /profile/edit - Formulari de modificació del perfil
GET /profile/activities - Llista d'activitats (veure, editar i eliminar activitats amb modals)
GET /profile/transactions - Llista de transaccions (acceptar pendents i valorar finalitzades)
GET /api/:idAct/request
falten rutes!!!!!

```

## MODELS

```

USUARI

Id: auto
Nom: String
Cognoms: String
Nom d'usuari: String
Password: String
Mail: String
Direcció: Object{
  - tipus de via: String
  - Nom de via: String
  - Numero: Number
  - Codi Postal: String
  - Població: String
  - Província: String
  - País: String
}
Latitud: Number
Longitud: Number
Telèfon de contacte: String
Presentació personal: String
Imatge: String
Rating average: Number
Rating Usuari: Array d'objectes
  {
    - id usuari: String
    - rating: Number
    - review: String
  }
Transaccions: Array d'objectes
{
  - id Usuari involucrat: String
  - estat transacció: Enum d'Strings (Proposat/Acceptat/Rebutjat/Cancelat/Finalitzada)
  - id Activitat: String
}
Activitats ofertades: Array d'idActivitat (POPULATE ACTIVITAT)
Activitats demandades: Array d'idActivitat (POPULATE ACTIVITAT)

```

ACTIVITAT

- Id: String
- Sector: String
- Subsector: String
- Descripció: String
- Tags: array d'Strings
- Imatges: array d'Strings
- Horaris: Array d'objectes:
  {
    dia: Enum Number (0-6),
    franja: array [Enum Number (0-47)]
  }
- Durada_h: Number 
- Rating average: Number
- Rating activitat: array d'Objectes
  {
    - usuari servidor: Objecte:
    {
      - id qui valora: String
      - rating: Number
      - review: String
    }
    - usuari receptor: Objecte
    {
      - id qui valora: String
      - rating: Number
      - review: String
    }
  }

```

## Links

### Trello

[Link to your trello board](https://trello.com)

### Git

The url to your repository and to your deployed project

[Repository Link](http://github.com)

[Deploy Link](http://heroku.com)

### Slides.com

The url to your presentation slides

[Slides Link](http://slides.com)