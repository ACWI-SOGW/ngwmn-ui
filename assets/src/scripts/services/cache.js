import { get } from 'ngwmn/lib/ajax';
import config from 'ngwmn/config';

const WL_URL = `${config.SERVICE_ROOT}/ngwmn_cache/direct/flatXML/waterlevel`;


/**
 * Makes service call to the NGWMN cache for a site's historical water levels.
 * @param  {String} agencyCode Site agency code
 * @param  {String} siteId     Site identifier
 * @return {Object}            Parsed XML with server response
 */
export const retrieveWaterLevels = function (agencyCode, siteId) {
    return get(`${WL_URL}/${agencyCode}/${siteId}`, 'responseXML')
       .then(xml => {
            // Handle null responses from the service
            if (xml === null) {
                return {
                    message: 'No water level data available',
                    elevationReference: {},
                    samples: []
                };
            }

            const elev = xml.documentElement.getElementsByTagName('elevation-reference')[0];
            const samples = xml.documentElement.getElementsByTagName('samples')[0];
            return {
                elevationReference: {
                    siteElevation: elev.getElementsByTagName('site-elevation')[0].textContent,
                    siteElevationDatum: elev.getElementsByTagName('site-elevation-datum')[0].textContent
                },
                samples: Array.prototype.map.call(samples.getElementsByTagName('sample'), sample => {
                    return {
                        agency: sample.getElementsByTagName('agency')[0].textContent,
                        sourceCode: sample.getElementsByTagName('source-code')[0].textContent,
                        site: sample.getElementsByTagName('site')[0].textContent,
                        time: sample.getElementsByTagName('time')[0].textContent,
                        pcode: sample.getElementsByTagName('pcode')[0].textContent,
                        direction: sample.getElementsByTagName('direction')[0].textContent,
                        unit: sample.getElementsByTagName('unit')[0].textContent,
                        originalValue: sample.getElementsByTagName('original-value')[0].textContent,
                        fromLandsurfaceValue: sample.getElementsByTagName('from-landsurface-value')[0].textContent,
                        fromDatumValue: sample.getElementsByTagName('from-datum-value')[0].textContent,
                        comment: sample.getElementsByTagName('comment')[0].textContent,
                        accuracyValue: sample.getElementsByTagName('accuracy-value')[0].textContent,
                        accuracyUnit: sample.getElementsByTagName('accuracy-unit')[0].textContent
                    };
                })
            };
        }).catch(reason => {
            return {
                error: true,
                message: reason.message,
                elevationReference: {},
                samples: []
            };
        });
};
