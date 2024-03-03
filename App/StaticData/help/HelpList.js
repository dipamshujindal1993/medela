import KeyUtils from "../../Utils/KeyUtils";
import I18n from '@i18n';

const HelpList = {
  "HelpListData":[
    {
			selectedImage: KeyUtils.HELP_TYPE_PROBLEM_SOLVER,
			title: I18n.t('help.problem_solver'),
		},
		{
			selectedImage: KeyUtils.HELP_TYPE_APP_TECHNICAL_SUPPORT,
			title: I18n.t('help.app_technical_support'),
		},
		{
			selectedImage: KeyUtils.HELP_TYPE_CUSTOMER_SERVICE,
			title: I18n.t('help.customer_service'),
		},
		{
			selectedImage: KeyUtils.HELP_TYPE_LACTATION_CONSULTANT,
			title: I18n.t('help.lactation_consultant'),
		},
  ]
}
export default HelpList