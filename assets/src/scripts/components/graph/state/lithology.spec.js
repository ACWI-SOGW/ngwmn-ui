import { scaleLinear } from 'd3-scale';
import { combineReducers, createStore } from 'redux';

import services from 'ngwmn/services/state/index';
import getMockStore from 'ngwmn/store.mock';

import {
    getCurrentWellLog, getLithology, getWellLogEntries, getWellLogExtentY
} from './lithology';



describe('graph component lithology state', () => {
    let store;

    beforeEach(() => {
        store = createStore(combineReducers({
            ...services
        }), {});
    });

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
            const store = getMockStore();
            expect(getCurrentWellLog(store.getState())).not.toBe(null);
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
            const store = getMockStore();
            expect(getWellLogEntries(store.getState())).not.toBe(null);
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
            const store = getMockStore();
            expect(getWellLogEntries(store.getState())).not.toBe(null);
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
            const store = getMockStore();
            expect(getLithology('main')(store.getState())).not.toBe(null);
        });
    });
});
