import React from "react";
import KeyUtils from "../../Utils/KeyUtils";
import I18n from '@i18n';

let TestsItemData = {
  "itemData":[
    {
			image: KeyUtils.TEST_TYPE_BREASTFEEDING_CONFIDENCE,
			title: I18n.t('tests.test_bca_title'),
			content: I18n.t('tests.test_bca_content'),
		},
		{
			image: KeyUtils.TEST_TYPE_CONTENT_PERSONALISATION,
			title: I18n.t('tests.test_cp_title'),
			content: I18n.t('tests.test_cp_content'),
		},
  ]
}
export default TestsItemData