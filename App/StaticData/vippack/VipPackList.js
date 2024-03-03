import React from "react";
import KeyUtils from "../../Utils/KeyUtils";
import I18n from '@i18n';

let VipPackList = {
  "VipPackListData":[
    {
		  selectedImage: KeyUtils.PACK_TYPE_VOICE_CONTROL,
      title: I18n.t('vip_pack.voice_control'),
      content: I18n.t('vip_pack.voice_control_content'),
	},
	{
		selectedImage: KeyUtils.PACK_TYPE_DARK_MODE,
    title: I18n.t('vip_pack.dark_mode'),
    content: I18n.t('vip_pack.dark_mode_content'),
	},
  ]
}
export default VipPackList