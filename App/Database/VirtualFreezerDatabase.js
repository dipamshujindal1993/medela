import { getRealmDb } from "./AddBabyDatabase";
const Realm = require('realm');


export function saveVirtualFreezerDatabase(realm,item) {
  return new Promise(function (resolve, reject) {
    let realm = getRealmDb();
    realm.write(() => {
      realm.create('VirtualFreezerSchema', item,'modified');
      resolve()
    });
  })
}

export function openFreezerDb(){
    return new Promise(function (resolve, reject) {
      let realm = getRealmDb()
      resolve()
      return realm
    }) 
    .catch(error => {
      console.log(error);
    });
}

export function deleteFreezerFromDb(inventoryId) {
    return new Promise(function (resolve, reject) {
      let realm = getRealmDb()
      realm.write(() => {
        let selectedItem = realm.objects('VirtualFreezerSchema');
        let obj = selectedItem.find((e)=>e.id===inventoryId)
        let dd=realm.delete(obj)
        console.log('inventory deleteObj-',dd)
      });
      resolve()
      return {ok:true}
    })
    .catch(error => {
      console.log('inventory deleteObj error-', error);
      return {ok:false}
    });
}
