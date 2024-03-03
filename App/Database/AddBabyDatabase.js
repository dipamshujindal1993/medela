import {
  AddBabySchema,
  StatusFlags,
  TimelineSchema,
  TrackingSchema,
  UnitSchema,
  MotherProfileSchema,
  ImageSchema, UserMotherProfileSchema, ClientSchema, NotificationSchema, VirtualFreezerSchema,ChatbotSchema, UserSchema, QuickRepliesSchema, ArticlesSchema, ValuesSchema ,MyItemsSchema,CheckListSelectionSchema,DeletedItemsSchema
} from "./Schemas";
const Realm = require('realm');
let realmInit;

export function openRealmDb() {
  return Realm.open({ schema: [TrackingSchema, StatusFlags, AddBabySchema, UnitSchema, TimelineSchema, UserMotherProfileSchema, MotherProfileSchema, ClientSchema, NotificationSchema, ImageSchema, VirtualFreezerSchema ,ChatbotSchema, UserSchema, QuickRepliesSchema, ArticlesSchema, ValuesSchema,MyItemsSchema,CheckListSelectionSchema,DeletedItemsSchema] })
    .then(realm => {
      realmInit = realm;
      return realm
    })
    .catch(error => {
      console.log(error);
    });
}

export function getRealmDb() {
  return realmInit;
}
export function openBabiesSchema() {
  return new Promise(function (resolve, reject) {
    resolve();
      return realmInit
    })
    .catch(error => {
      return error
    });
}
export function addBaby(item) {
  return new Promise(function (resolve, reject) {
      // Create Realm objects and write to local storage
      realmInit.write(() => {
        const addBaby = realmInit.create('AddBaby', item,'modified');
        console.log('addBaby--',addBaby)
      });

      // Remember to close the realm when finished.
      resolve()
      return {success:true}
    })
    .catch(error => {
      console.log('error',error);
      return {success:false}
    });
}


export function updateBaby(realm,item) {
  return new Promise(function (resolve, reject) {
    realmInit.write(() => {
      let saveBaby = realmInit.create('AddBaby', item,'modified');
      console.log('updateBabySuccess--',saveBaby)
      resolve()
    });
  })
}

export function deleteBabyFromDb(babyId) {
    return new Promise(function (resolve, reject) {
      realmInit.write(() => {
        let selectedItem = realmInit.objects('AddBaby');
        let obj = selectedItem.find((e)=>e.babyId===babyId)
        let dd=realmInit.delete(obj)
        console.log('deleteObj-',dd)
      });
      resolve();
      return {ok:true}
    })
    .catch(error => {
      console.log(error);
      return {ok:false}
    });
}

export function deleteBabyDatabase(babyId) {
    return new Promise(function (resolve, reject) {
      realmInit.write(() => {
        let selectedItem = realmInit.objects('AddBaby');
        let obj = selectedItem.filter((e)=>e.babyId===babyId)
        realmInit.delete(obj)
      });
      resolve();
      return {ok:true}
    })
    .catch(error => {
      console.log(error);
      return {ok:false}
    });
}

export function saveAllBabies(realm,babies){
  return new Promise(function (resolve, reject) {
    realmInit.write(() => {
      babies.forEach((item)=>{
        let saveBaby = realmInit.create('AddBaby', item,'modified');
        // console.log('saveBay--',saveBaby)
      })

      resolve()
    });
  })
}


export function saveMotherProfile(realm,item) {
  return new Promise(function (resolve, reject) {
    realmInit.write(() => {
      const saveProfile = realmInit.create('UserMotherProfile', item,'modified');
      resolve()
      return {ok:true}

    });
  })
}

export function deleteMotherProfileTimeLine() {
    return new Promise(function (resolve, reject) {
      realmInit.write(() => {
        let selectedItem = realmInit.objects('UserMotherProfile');
        let timeLine = realmInit.objects('Timeline');
        realmInit.delete(selectedItem)
        realmInit.delete(timeLine)
      });
      resolve();
      return {ok:true}
    })
    .catch(error => {
      console.log(error);
      return {ok:false}
    });
}

export function readMotherProfile() {
    return new Promise(function (resolve, reject) {
      // Create Realm objects and write to local storage
      resolve()
      return realmInit
    })
    .catch(error => {
      console.log(error);
    });
}


export function saveTimeLine(realm,timeLineArr) {
  return new Promise(function (resolve, reject) {
    realmInit.write(() => {
      timeLineArr.forEach((item)=>{
        realmInit.create('Timeline', item,'modified');
      })

      resolve()
    });
  })
}
