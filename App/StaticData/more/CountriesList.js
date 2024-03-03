import KeyUtils from "../../Utils/KeyUtils";
import I18n from 'react-native-i18n'

let CountriesList = {
  "countriesListData":[
    {
		countryImage: KeyUtils.ENGLISH,
		countryName: I18n.t('countries.English_International'),
		countryCode: 'en'
	},
	{
		countryImage: KeyUtils.ARABIC,
		countryName: I18n.t('countries.Arabic'),
		countryCode: 'ar'
	},
	{
		countryImage: KeyUtils.FRENCH,
		countryName: I18n.t('countries.French'),
		countryCode: 'fr'
	},
	{
		countryImage: KeyUtils.ITANIAN_ITALY,
		countryName: I18n.t('countries.Italiano_Italy'),
		countryCode: 'it'
	},
	{
		countryImage: KeyUtils.GERMAN,
		countryName: I18n.t('countries.German'),
		countryCode: 'de'
	},
	{
		countryImage: KeyUtils.PORTUGAL,
		countryName: I18n.t('countries.Português_Portugal'),
		countryCode: 'pt'
	},
	{
		countryImage: KeyUtils.ESPANOL_SPAIN,
		countryName: I18n.t('countries.Español_Spain'),
		countryCode: 'es'
	},
	{
		countryImage: KeyUtils.DUTCH_NETHERLANDS,
		countryName: I18n.t('countries.Dutch_Netherlands'),
		countryCode: 'nl'
	},
	{
		countryImage: KeyUtils.SVENSKA_SWEDEN,
		countryName: I18n.t('countries.Svenska_Sweden'),
		countryCode: 'sv'
	},
	{
		countryImage: KeyUtils.NORSK_NORWAY,
		countryName: I18n.t('countries.Norsk_Norway'),
		countryCode: 'no'
	},
	{
		countryImage: KeyUtils.DANSK_DENMARK,
		countryName: I18n.t('countries.Dansk_Denmark'),
		countryCode: 'da'
    },
    {
		countryImage: KeyUtils.RUSSIA,
		countryName: I18n.t('countries.русский_Russia'),
		countryCode: 'ru'
    },
	{
		countryImage: KeyUtils.POLISH,
		countryName: I18n.t('countries.polish'),
		countryCode: 'pl'
    }
  ]
}
export default CountriesList;
