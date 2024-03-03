import React from "react";
import KeyUtils from "../../Utils/KeyUtils";
import I18n from '@i18n';

let MoreList = {
  "moreFirstListData":[
    {
		selectedImage: KeyUtils.MORE_TYPE_MOTHER_INFO,
		title: I18n.t('more.mom_profile'),
		content: I18n.t('more.mom_info_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_BABY_INFO,
		title: I18n.t('more.baby_profile'),
		content: I18n.t('more.baby_info_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_PUMP_SETTINGS,
		title: I18n.t('more.pump_title'),
		content: I18n.t('more.pump_info_title'),
	},
  ],
  "moreSecondListData":[
	{
		selectedImage: KeyUtils.MORE_TYPE_VIP_PACK,
		title: I18n.t('more.vip_pack_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_ONLINE_SHOP,
		title: I18n.t('more.online_store'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_STORE_LOCATOR,
		title: I18n.t('more.store_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_SHARE_APP,
		title: I18n.t('more.share_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_FEEDBACK,
		title: I18n.t('more.feedback_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_HELP,
		title: I18n.t('more.help_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_SETTINGS,
		title: I18n.t('more.settings_title'),
	},
	{
		selectedImage: KeyUtils.MORE_TYPE_LEGAL,
		title: I18n.t('more.legal_title'),
	},
  ]
}
export default MoreList