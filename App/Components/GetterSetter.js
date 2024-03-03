class GetterSetter {
  static lastIndex = 0;
  static pumpRunning = null;
  static apiCallCount = null;
  static pumpId = null;
  static parentScreen = null;
  static pumpName = null;
  static leftTimer = null;
  static rightTimer = null;
  static userChangedWithoutCompletedItsProfile=false;


  static getUserChangedWithoutCompletedItsProfile(){
    return this.userChangedWithoutCompletedItsProfile;
  }
  static setUserChangedWithoutCompletedItsProfile(value){
    this.userChangedWithoutCompletedItsProfile=value;
    return this.userChangedWithoutCompletedItsProfile;
  }
  static getLastRecordIndex(){
    return this.lastIndex;
  }
  static setLastRecordIndex(value){
    console.log('lastIndex UPDATED = ', value)
    this.lastIndex = value
    return this.lastIndex;
  }

  static getIsPumpRunning(){
    return this.pumpRunning;
  }
  static setIsPumpRunning(value){
    console.log('pump state UPDATED')
    this.pumpRunning = value
    return this.pumpRunning;
  }

  static getApiCallCount(){
    return this.apiCallCount;
  }
  static setApiCallCount(value){
    console.log('apiCallCount UPDATED')
    this.apiCallCount = value
    return this.apiCallCount;
  }

  static getPumpId(){
    return this.pumpId;
  }
  static setPumpId(value){
    console.log('pumpId UPDATED')
    this.pumpId = value
    return this.pumpId;
  }

  static getParentScreen(){
    return this.parentScreen;
  }
  static setParentScreen(value){
    console.log('parentScreen -- ', value)
    this.parentScreen = value
    return this.parentScreen;
  }

  static getPumpName(){
    return this.pumpName;
  }
  static setPumpName(value){
    console.log('pumpName -- ', value)
    this.pumpName = value
    return this.pumpName;
  }

  static getIsLeftTimerActive(){
    return this.leftTimer;
  }
  static setIsLeftTimerActive(value){
    console.log('pumpName -- ', value)
    this.leftTimer = value
    return this.leftTimer;
  }

  static getIsRightTimerActive(){
    return this.rightTimer;
  }
  static setIsRightTimerActive(value){
    console.log('pumpName -- ', value)
    this.rightTimer = value
    return this.rightTimer;
  }

}

export default GetterSetter;
