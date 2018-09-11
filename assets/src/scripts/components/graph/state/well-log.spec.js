import { scaleLinear } from 'd3-scale';

import getMockStore from 'ngwmn/store.mock';
import {
    getCurrentWellLog, getConstructionElements, getLithology,
    getWellLogEntries, getWellLogExtentY, getWellWaterLevel
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

    describe('getConstructionElements', () => {
        const elements = [{
            type: 'screen',
            position: {
                coordinates: {
                    start: 100,
                    end: 200
                }
            },
            diameter: {
                value: 10
            }
        }, {
            type: 'screen',
            position: {
                coordinates: {
                    start: 10,
                    end: 100
                }
            },
            diameter: {
                value: 12
            }
        }, {
            type: 'screen',
            position: {
                coordinates: {
                    start: 10,
                    end: 100
                }
            },
            diameter: {
                value: 10
            }
        }];

        it('returns correct data properly sorted', () => {
            expect(getConstructionElements('main').resultFunc(
                elements,
                scaleLinear(),
                scaleLinear()
            )).toEqual([{
                type: 'screen',
                radius: 6,
                thickness: 0.5,
                left: {
                    x: -6,
                    y1: 10,
                    y2: 100
                },
                right: {
                    x: 6,
                    y1: 10,
                    y2: 100
                }
            }, {
                type: 'screen',
                radius: 5,
                thickness: 0.5,
                left: {
                    x: -5,
                    y1: 10,
                    y2: 100
                },
                right: {
                    x: 5,
                    y1: 10,
                    y2: 100
                }
            }, {
                type: 'screen',
                radius: 5,
                thickness: 0.5,
                left: {
                    x: -5,
                    y1: 100,
                    y2: 200
                },
                right: {
                    x: 5,
                    y1: 100,
                    y2: 200
                }
            }]);
        });

        it('works with no elements', () => {
            expect(getConstructionElements('main').resultFunc([])).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getConstructionElements('main')(
                getMockStore().getState())
            ).not.toBe(null);
        });
    });

    describe('getWellWaterLevel', () => {
        it('works', () => {
            expect(getWellWaterLevel('main').resultFunc(
                scaleLinear().range([0, 100]).domain([0, 100]),
                scaleLinear().range([0, 100]).domain([new Date('2009-10-10'),
                                                      new Date('2011-10-10')]),
                {value: new Date('2010-10-10')},
                [0, 100]
            )).toEqual({
                x: 5,
                y: 50,
                width: 90,
                height: 0
            });
        });

        it('works with mock state', () => {
            expect(getWellWaterLevel('main')(getMockStore().getState())).not.toBe(null);
        });
    });
});
