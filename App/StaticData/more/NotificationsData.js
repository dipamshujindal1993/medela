import I18n from '@i18n';

let NotificationsData = {
  "NotificationsData":[
    // {
		// 	notifications_heading: I18n.t('notifications.outofapp_notifications'),
		// 	notification_description: I18n.t('notifications.outofapp_description'),
    //   notifications_list: I18n.t('notifications.outofapp_notifications_list')
    // },
    {
			notifications_heading: I18n.t('notifications.inapp_notifications'),
			notification_description: I18n.t('notifications.inapp_description'),
      notifications_list: I18n.t('notifications.inapp_notifications_list')
    },
    {
			notifications_heading: I18n.t('notifications.marketing_opt_ins_notifications'),
			notification_description: I18n.t('notifications.marketing_opt_ins_description'),
      notifications_list: I18n.t('notifications.marketing_opt_ins_notifications_list')
    }
  ]
}
export default NotificationsData;
