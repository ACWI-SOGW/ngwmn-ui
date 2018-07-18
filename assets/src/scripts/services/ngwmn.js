import { get } from 'ngwmn/lib/ajax';
import config from 'ngwmn/config';

const WL_URL = `${config.SERVICE_ROOT}/ngwmn_cache/direct/flatXML/waterlevel`;

export const getWaterLevels(agencyCode, siteID) {
    get(`${WL_URL}/${agencyCode}/${siteID}`).then(responseText => {
        console.log(responseText);
    }).catch(reason => {
        console.error(reason);
        return [];
    });
}
