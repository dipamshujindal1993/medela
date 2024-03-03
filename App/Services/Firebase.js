import analytics from '@react-native-firebase/analytics';
import KeyUtils from '../Utils/KeyUtils';
import { Subject } from 'rxjs';
class Analytics{
    async logOnPress(itemTitle){
        return await analytics().logEvent(KeyUtils.On_Press,{
            'button':itemTitle
        })
    }
    async logEvent(itemTitle, params){
        console.log('EVENT fire === ',itemTitle, params)
      return await analytics().logEvent(itemTitle,params)
    }
    async logScreenView(currentScreen){
        return await analytics().logScreenView({
            screen_name: currentScreen,
            screen_class: currentScreen,
        });
    }
   async setProperties(properties){
    return await analytics().setUserProperties(properties);
   }
   async setProperty(key, value){
       return await analytics().setUserProperty(key, value);
   }
}
const subject = new Subject();
const updatePopupService = {
    setData: d => subject.next({ value: d }),
    clearData: () => subject.next(),
    getData: () => subject.asObservable()
};
export {Analytics,updatePopupService};
