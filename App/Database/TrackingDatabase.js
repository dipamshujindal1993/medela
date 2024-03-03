import { getRealmDb } from "./AddBabyDatabase";

const Realm = require('realm');

export function createTrackedItem(item) {
  return new Promise(function (resolve, reject) {
    let realm = getRealmDb();
      // Create Realm objects and write to local storage
      realm.write(() => {
       let trackingItems = realm.create('Tracking', item,'modified');
      });
      resolve();
      return {ok:true}
    })
    .catch(error => {
      console.log(error);
      return {ok:false}
    });

}

export function createAllTrackedItems(realm,itemsList) {
  return new Promise(function (resolve, reject) {
    let realm = getRealmDb();

    realm.write(() => {
      itemsList.forEach((item)=>{
        let trackingItems = realm.create('Tracking', item,'modified');
      })
      console.log('createAllTrackedItems--')
      resolve()
    });
  })

}


export function readTrackingSchemaItems() {
    return new Promise(function (resolve, reject) {
      let realm = getRealmDb();
      // Create Realm objects and write to local storage
      resolve();
      return realm
    })
    .catch(error => {
      console.log(error);
    });
}


export function updateTrackingItem(item) {
    return new Promise(function (resolve, reject) {
      let realm = getRealmDb();
      // Create Realm objects and write to local storage
      realm.write(() => {
        let trackingItems = realm.create('Tracking', item,'modified');
        console.log('updateTrackingItem--',trackingItems)
      });
      resolve();
    })
    .catch(error => {
      let response={ok:false}
      console.log(error);
    });

}

export function deleteTrackingItem(trackingId) {
    return new Promise(function (resolve, reject) {
      let realm = getRealmDb();
      realm.write(() => {
        let selectedItem = realm.objects('Tracking');
        let obj = selectedItem.filter((e)=>e.id==trackingId)
        console.log('Delete object--',obj)
        realm.delete(obj)
      });
      resolve()
    })
    .catch(error => {
      console.log(error);
    });
}
