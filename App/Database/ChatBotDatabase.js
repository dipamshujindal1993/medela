import { getRealmDb } from './AddBabyDatabase';

const Realm = require('realm');

export function createChatbotSchema(list,username) {
  return new Promise(function (resolve, reject) {
    let realm = getRealmDb()
    realm.write(() => {
      list.forEach((item)=>{
        let currentItem=item
        currentItem['username']=username
        let messagesList = realm.create('Chatbot', currentItem, 'modified');

      })
    });
    resolve()
    return {ok:true}
  })
}

export function readChatbotSchema() {
    return new Promise(function (resolve, reject) {
      let realm = getRealmDb()
      // Create Realm objects and write to local storage
      resolve()
      return realm
    })
    .catch(error => {
      console.log(error);
    });
}
