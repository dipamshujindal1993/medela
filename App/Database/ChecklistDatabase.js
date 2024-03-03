const Realm = require('realm');

export function addItem(realm,item) {
  return new Promise(function (resolve, reject) {
    realm.write(() => {
      const myCar = realm.create('MyItems', item);
      //myCar.miles += 20; // Update a property value
      console.log('success--',myCar)
      resolve()
    });
  })
}


export function addDeletedItem(realm,item) {
  return new Promise(function (resolve, reject) {
    realm.write(() => {
      const myCar = realm.create('ChecklistDeletedItems', item);
    });
    resolve()
    return {ok:true}
  })
}



export function readMyItems(realm) {

  return new Promise(function (resolve, reject) {
      // Create Realm objects and write to local storage
      return realm
    })
    .catch(error => {
      console.log(error);

    });
}

export function readSelectionSchema(realm) {
  return new Promise(function (resolve, reject) {
      // Create Realm objects and write to local storage
      return realm
    })
    .catch(error => {
      console.log(error);
    });
}

export function readDeletedItemsSchema(realm) {
  return new Promise(function (resolve, reject) {
      // Create Realm objects and write to local storage
      return realm
    })
    .catch(error => {
      console.log(error);
    });
}

export function updateItems(realm,item) {
  return new Promise(function (resolve, reject) {
    realm.write(() => {
      realm.create('CheckListSelection', item, 'modified');
    });
    resolve()
    return {ok:true}
  })
}


export function deleteItem(realm,item) {
  return new Promise(function (resolve, reject) {
    realm.write(() => {
      let selectedItem = realm.objects('CheckListSelection');
      let uuid=item.uuid
      let obj = selectedItem.filter((e)=>e.uuid==uuid)
      realm.delete(obj)
    });
    resolve()
    return {ok:true}
  })
}

export function clearAllEnabledItems(realm,selectedItemUuid) {
  return new Promise(function (resolve, reject) {
      realm.write(() => {
        let selectedItem = realm.objects('CheckListSelection');
        let uuid=selectedItemUuid
        let obj = selectedItem.filter((e)=>e.selectedItemUuid==uuid)
        realm.delete(obj)
      });
    resolve()
    return {ok:true}
  })

}

