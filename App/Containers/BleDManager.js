import {BleManager} from "react-native-ble-plx";

class BleDManager {
  static MBleManager = null;

  static getBleManagerInstance(){
    if(this.MBleManager == null){
      console.log('BLE MANAGER')
      this.MBleManager = new BleManager();
    }
    return this.MBleManager;
  }
  static updateBleManager(){
      console.log('BLE MANAGER UPDATED')
      this.MBleManager = new BleManager();
    return this.MBleManager;
  }

}

export default BleDManager;
