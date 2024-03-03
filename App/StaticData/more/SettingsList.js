import KeyUtils from "../../Utils/KeyUtils";
import I18n from '@i18n';

let SettingsList = {
  "settingsListData":[
    {
			selectedImage: KeyUtils.SETTINGS_LANGUAGE,
			title: I18n.t('settings.language_title'),
			content: I18n.t('settings.language_info_title'),
		},
		{
			selectedImage: KeyUtils.SETTINGS_NOTIFICATION,
			title: I18n.t('settings.notification_title'),
			content: I18n.t('settings.notification_info_title'),
		},
		{
			selectedImage: KeyUtils.SETTINGS_MEASUREMENTS,
			title: I18n.t('settings.Measurements_title'),
			content: I18n.t('settings.Measurements_info_title'),
		},
  ]
}
export default SettingsList;