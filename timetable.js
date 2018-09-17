module.exports = {
  constructor(timetableArray) {
    this.timetableArray = timetableArray;
    this.timetableNumberedStructure = {
      monday:[],
      tuesday:[],
      wednesday:[],
      thursday:[],
      friday:[],
      saturday:[],
      sunday:[]
    };
    this.timetableFinalStructure = {
      monday:[],
      tuesday:[],
      wednesday:[],
      thursday:[],
      friday:[],
      saturday:[],
      sunday:[]
    };
    this._setTimetableNumberedStructure();
  },
  _setTimetableNumberedStructure(){
    this.timetableArray.forEach(timePosition => {
      switch(timePosition.day)
      {
        case 0:
          this.timetableNumberedStructure.monday.push(timePosition.timeSlot);
        break;
        case 1:
          this.timetableNumberedStructure.tuesday.push(timePosition.timeSlot);
        break;
        case 2:
          this.timetableNumberedStructure.wednesday.push(timePosition.timeSlot);
        break;
        case 3:
          this.timetableNumberedStructure.thursday.push(timePosition.timeSlot);
        break;
        case 4:
          this.timetableNumberedStructure.friday.push(timePosition.timeSlot);
        break;
        case 5:
          this.timetableNumberedStructure.saturday.push(timePosition.timeSlot);
        break;
        case 6:
          this.timetableNumberedStructure.sunday.push(timePosition.timeSlot);
        break;
      }
    });
  },
  _fromDecimalToStringTime(decimal){
    let int = Math.floor(decimal);
    let dec = decimal - int;
    return int.toString() + ':' + dec.toString();
  },

  _setTimetableFinalStructureByDay(day)
  {
    let lastTimeSlot = -10;
    let compactedTimeSlot = [];
    this.timetableNumberedStructure[day].forEach(timeSlot => {
      if(timeSlot < lastTimeSlot -1)
      {
        compactedTimeSlot.push({from: _fromDecimalToStringTime(timeSlot/2)});
      }
      compactedTimeSlot[compactedTimeSlot.length-1].to = this._fromDecimalToStringTime(timeSlot/2);
      lastTimeSlot = timeSlot;
    }.bind(this));
    this.timetableFinalStructure.day = compactedTimeSlot;
  },

  _setTimetableFinalStructure(){
    if(this.timetableNumberedStructure.monday != []) this._setTimetableFinalStructureByDay('monday');
    if(this.timetableNumberedStructure.tuesday != []) this._setTimetableFinalStructureByDay('tuesday');
    if(this.timetableNumberedStructure.wednesday != []) this._setTimetableFinalStructureByDay('wednesday');
    if(this.timetableNumberedStructure.thursday != []) this._setTimetableFinalStructureByDay('thursday');
    if(this.timetableNumberedStructure.friday != []) this._setTimetableFinalStructureByDay('friday');
    if(this.timetableNumberedStructure.saturday != []) this._setTimetableFinalStructureByDay('saturday');
    if(this.timetableNumberedStructure.sunday != []) this._setTimetableFinalStructureByDay('sunday');
  },

  getTimetableArray(){
    _setTimetableFinalStructure();
    return this.timetableFinalStructure;
  }
}