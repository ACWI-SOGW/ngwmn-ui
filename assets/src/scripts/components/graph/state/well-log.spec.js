import { scaleLinear } from 'd3-scale';

import getMockStore from 'ngwmn/store.mock';
import {
    getCasings, getCurrentWellLog, getLithology, getScreens, getWellLogEntries,
    getWellLogExtentY
} from './well-log';


describe('graph component well log state', () => {
    describe('getCurrentWellLog', () => {
        const wellLogs = {
            'log1': 'well log 1'
        };

        it('works with valid ID', () => {
            expect(getCurrentWellLog.resultFunc(wellLogs, 'log1')).toEqual('well log 1');
        });

        it('returns empty log with invalid ID', () => {
            expect(getCurrentWellLog.resultFunc(wellLogs, 'log2')).toEqual({});
        });

        it('works with mock state', () => {
            expect(getCurrentWellLog(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getWellLogEntries', () => {
        const logEntries = [1, 2, 3];
        const wellLog = {
            log_entries: logEntries
        };

        it('works', () => {
            expect(getWellLogEntries.resultFunc(wellLog)).toEqual(logEntries);
        });

        it('works with empty log', () => {
            expect(getWellLogEntries.resultFunc({})).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getWellLogEntries(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getWellLogExtentY', () => {
        const logEntries = [{
            shape: {
                coordinates: {
                    start: '1',
                    end: '2'
                }
            }
        }, {
            shape: {
                coordinates: {
                    start: '2',
                    end: '3'
                }
            }
        }];

        it('works', () => {
            expect(getWellLogExtentY.resultFunc(logEntries)).toEqual([1, 3]);
        });

        it('works with empty log', () => {
            expect(getWellLogExtentY.resultFunc([])).toEqual([0, 0]);
        });

        it('works with mock state', () => {
            expect(getWellLogEntries(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getLithology', () => {
        const logEntries = [{
            shape: {
                coordinates: {
                    start: '1',
                    end: '2'
                }
            }
        }, {
            shape: {
                coordinates: {
                    start: '2',
                    end: '3'
                }
            }
        }];
        const chartPos = {
            x: 10,
            y: 10,
            width: 100,
            height: 100
        };
        const scale = scaleLinear();

        it('works', () => {
            expect(getLithology('main').resultFunc(logEntries, chartPos, scale)).toEqual([{
                x: 10,
                y: 1,
                width: 100,
                height: 1,
                entry: {
                    shape: {
                        coordinates: {
                            start: '1',
                            end: '2'
                        }
                    }
                }
            }, {
                x: 10,
                y: 2,
                width: 100,
                height: 1,
                entry: {
                    shape: {
                        coordinates: {
                            start: '2',
                            end: '3'
                        }
                    }
                }
            }]);
        });

        it('works with empty log', () => {
            expect(getLithology('main').resultFunc([])).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getLithology('main')(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getCasings', () => {
        const casings = [{
            position: {
                coordinates: {
                    start: 10,
                    end: 100
                }
            }
        }];

        it('works', () => {
            expect(getCasings('main').resultFunc(casings, {
                width: 10
            }, scaleLinear(), scaleLinear()).length).toEqual(casings.length);
        });

        it('works with no casings', () => {
            expect(getCasings('main').resultFunc([])).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getCasings('main')(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getScreens', () => {
        const screens = [{
            position: {
                coordinates: {
                    start: 10,
                    end: 100
                }
            }
        }];

        it('works', () => {
            expect(getScreens('main').resultFunc(screens, {
                width: 10
            }, scaleLinear(), scaleLinear()).length).toEqual(screens.length);
        });

        it('works with no screens', () => {
            expect(getScreens('main').resultFunc([])).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getScreens('main')(getMockStore().getState())).not.toBe(null);
        });
    });
});
