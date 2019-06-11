import { post } from '../lib/ajax';
import config from 'ngwmn/config';

// median water level URL
const MWL_URL = `${config.SERVICE_ROOT}/statistics/calculate`;
// const MWL_URL = 'http://localhost:8777/statistics/calculate';


/**
 * Makes service call to the NGWMN cache for a site's historical water levels.
 * @param  {String} agencyCode Site agency code
 * @param  {String} siteId     Site identifier
 * @return {Object}            Parsed XML with server response
 */
export const retrieveMedianWaterLevels = function(waterLevels) {
    let data = '';
    let needsDirection = true;
    let direction = 'BelowLand';
    for (let s in waterLevels.samples) {
        const sample = waterLevels.samples[s];
        let aging = '';
        if (sample.comment === 'P' || sample.comment === 'p') {
            aging = 'P';
        }
        data = data + sample.time +','+ sample.originalValue +','+ aging +'%0A';

        if (needsDirection && sample.direction) {
            if (sample.direction === 'up') {
                direction = 'AboveDatum';
                needsDirection = false;
            }
            if (sample.direction === 'down') {
                direction = 'BelowLand';
                needsDirection = false;
            }
        }
    }
    data = 'medians=true&mediation='+ direction +'&data=' +data;


    return post(`${MWL_URL}`, {
        data:data,
        contentType:'application/x-www-form-urlencoded'
    }).then(json => {
        const errorResponse = {
            error: true,
            message: 'No water level data available',
            //json: json,
            medians: []
        };

        try {
            const data = JSON.parse(json);

            // this conditioning will be unnecessary when strict JSON is returned
            const medians = data.medians.substr(1,data.medians.length-2);
            const samples = medians.split('\n');
            while (samples[samples.length-1].trim().length === 0) {
                samples.pop();
            }

            return {
                medians: Array.prototype.map.call(samples, sample => {
                    let values = sample.split(',');
                    let median = values[1];
                    let monthYear = values[0].split('-');
                    let year = monthYear[0];
                    let month = monthYear[1];
                    return {
                        year: year.trim(), month: month.trim(), median: median.trim()
                    };
                })
            };
        } catch (e) {
            // Handles null and other bad responses from the service
            return errorResponse;
        }
    }).catch(reason => {
        return {
            error: true,
            message: reason.message,
            medians: []
        };
    });
};
// sample response json
// {"overall":
// {"RECORD_YEARS":"13.0","SAMPLE_COUNT":28,"LATEST_PCTILE":"0.31250","LATEST_VALUE":"11.000","MAX_VALUE":"1.000","MEDIAN":"1.500","MIN_VALUE":"43.000","CALC_DATE":"2018-12-06","MAX_DATE":"2018-06-10T04:15:00-05:00","MIN_DATE":"2005-06-10T04:15:00-05:00","MEDIATION":"BelowLand"},
// "monthly":{
// "6":{"RECORD_YEARS":"14","SAMPLE_COUNT":13,"PERCETILES":{"P25":"13.250","P50_MAX":"1.000","P90":"1.000","P50":"1.500","P50_MIN":"43.000","P10":"32.500","P75":"1.000"}},
// "7":{"RECORD_YEARS":"13","SAMPLE_COUNT":13,"PERCETILES":{"P25":"15.000","P50_MAX":"1.000","P90":"1.000","P50":"1.000","P50_MIN":"43.000","P10":"34.600","P75":"1.000"}}
// },
// "medians":"\"2016-06-10T04:15:00-05:00,43.000,\n2006-06-10T04:15:00-05:00,22.000,\n2010-06-10T04:15:00-05:00,20.000,\n2018-06-10T04:15:00-05:00,11.000,\n2014-06-10T04:15:00-05:00,10.000,\n2012-06-10T04:15:00-05:00,2.000,\n2008-06-10T04:15:00-05:00,2.000,\n2011-06-10T04:15:00-05:00,1.000,\n2009-06-10T04:15:00-05:00,1.000,\n2007-06-10T04:15:00-05:00,1.000,\n2017-06-10T04:15:00-05:00,1.000,\n2005-06-10T04:15:00-05:00,1.000,\n2015-06-10T04:15:00-05:00,1.000,\n2013-06-10T04:15:00-05:00,1.000,\n2016-07-10T04:15:00-05:00,43.000,\n2006-07-10T04:15:00-05:00,22.000,\n2010-07-10T04:15:00-05:00,20.000,\n2014-07-10T04:15:00-05:00,10.000,\n2012-07-10T04:15:00-05:00,2.000,\n2008-07-10T04:15:00-05:00,2.000,\n2011-07-10T04:15:00-05:00,1.000,\n2009-07-10T04:15:00-05:00,1.000,\n2007-07-10T04:15:00-05:00,1.000,\n2017-07-10T04:15:00-05:00,1.000,\n2005-07-10T04:15:00-05:00,1.000,\n2015-07-10T04:15:00-05:00,1.000,\n2013-07-10T04:15:00-05:00,1.000,\n\"","errors":[],"ok":true}
