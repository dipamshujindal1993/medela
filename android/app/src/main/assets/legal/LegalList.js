import React from "react";
import KeyUtils from "../../Utils/KeyUtils";
import I18n from '@i18n';

let LegalList = {
  "LegalListData":[
    {
		selectedImage: KeyUtils.LEGAL_TYPE_PRIVACY_TERMS_AND_CONDITION,
		title: I18n.t('legal.privacy_terms_conditions'),
	},
	{
		selectedImage: KeyUtils.LEGAL_TYPE_LICENSES,
		title: I18n.t('legal.licences'),
	},
	{
		selectedImage: KeyUtils.LEGAL_TYPE_IMPRINT,
		title: I18n.t('legal.imprint'),
	},
  ]
}
export default LegalList