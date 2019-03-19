import { scaleLinear } from 'd3-scale';

import getMockStore from 'ngwmn/store.mock';
import {
    getCurrentWellLog, getConstructionElements, getConstructionExtentY,
    getLithology, getWellLogEntries, getWellLogEntriesExtentY,
    getWellLogExtentY, getWellWaterLevel
} from './well-log';


describe('graph component well log state', () => {
    const mockOpts = {
        agencyCode: 'USGS',
        id: 23,
        siteId: '423532088254601',
        siteKey: 'USGS:423532088254601'
    };

    describe('getCurrentWellLog', () => {
        const wellLogs = {
            'log1': 'well log 1'
        };

        it('works with valid ID', () => {
            expect(getCurrentWellLog({siteKey: 'log1'}).resultFunc(wellLogs)).toEqual('well log 1');
        });

        it('returns empty log with invalid ID', () => {
            expect(getCurrentWellLog({siteKey: 'log2'}).resultFunc(wellLogs)).toEqual({});
        });

        it('works with mock state', () => {
            expect(getCurrentWellLog(mockOpts)(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getWellLogEntries', () => {
        const logEntries = [1, 2, 3];
        const wellLog = {
            log_entries: logEntries
        };

        it('works', () => {
            expect(getWellLogEntries({}).resultFunc(wellLog)).toEqual(logEntries);
        });

        it('works with empty log', () => {
            expect(getWellLogEntries({}).resultFunc({})).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getWellLogEntries(mockOpts)(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getWellLogEntriesExtentY', () => {
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
            expect(getWellLogEntriesExtentY({}).resultFunc(logEntries)).toEqual([1, 3]);
        });

        it('works with empty log', () => {
            expect(getWellLogEntriesExtentY({}).resultFunc([])).toEqual([0, 0]);
        });

        it('works with mock state', () => {
            expect(getWellLogEntriesExtentY(mockOpts)(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getWellLogExtentY', () => {
        it('works', () => {
            expect(getWellLogExtentY({}).resultFunc([0, 3], [1, 4])).toEqual([0, 4]);
        });

        it('works with mock state', () => {
            expect(getWellLogExtentY(mockOpts)(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getConstructionExtentY', () => {
        const elements = [{
            position: {
                coordinates: {
                    start: '1',
                    end: '2'
                }
            }
        }, {
            position: {
                coordinates: {
                    start: '2',
                    end: '3'
                }
            }
        }];

        it('works', () => {
            expect(getConstructionExtentY(mockOpts).resultFunc(elements)).toEqual([1, 3]);
        });

        it('works with mock state', () => {
            expect(getConstructionExtentY(mockOpts)(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getLithology', () => {
        const logEntries = [{
            id: 23,
            shape: {
                coordinates: {
                    start: '1',
                    end: '2'
                },
                'unit': 'ft'
            },
            unit: {
                description: 'Siltstone',
                ui: {
                    colors: ['brown'],
                    materials: [616, 617, 618, 669, 631]
                },
                composition: {
                    material: {
                        name: 'Siltstone'
                    }
                }
            }
        }, {
            id: 99,
            shape: {
                coordinates: {
                    start: '2',
                    end: '3'
                },
                'unit': 'ft'
            },
            unit: {
                description: 'Siltstone',
                ui: {
                    colors: ['yellow'],
                    materials: [616, 617, 618, 669, 631]
                },
                composition: {
                    material: {
                        name: 'Siltstone'
                    }
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
            expect(getLithology({}, 'main').resultFunc(logEntries, chartPos, scale)).toEqual([{
                id: 23,
                x: 10,
                y: 1,
                width: 100,
                height: 1,
                colors: ['brown'],
                materials: [616, 617, 618, 669, 631],
                title: '1 - 2 ft, Siltstone'
            }, {
                id: 99,
                x: 10,
                y: 2,
                width: 100,
                height: 1,
                colors: ['yellow'],
                materials: [616, 617, 618, 669, 631],
                title: '2 - 3 ft, Siltstone'
            }]);
        });

        it('works with empty log', () => {
            expect(getLithology(mockOpts, 'main').resultFunc([])).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getLithology(mockOpts, 'main')(getMockStore().getState())).not.toBe(null);
        });
    });

    describe('getConstructionElements', () => {
        const elements = [{
            id: 'screen-0',
            type: 'screen',
            position: {
                coordinates: {
                    start: 100,
                    end: 200
                }
            },
            diameter: {
                value: 10,
                unit: 'in'
            }
        }, {
            id: 'screen-1',
            type: 'screen',
            position: {
                coordinates: {
                    start: 10,
                    end: 100
                }
            },
            diameter: {
                value: 12,
                unit: 'in'
            }
        }, {
            id: 'screen-2',
            type: 'screen',
            position: {
                coordinates: {
                    start: 10,
                    end: 100
                }
            }
        }, {
             id: 'screen-3',
            type: 'screen',
            position: {
                coordinates: {
                    start: 201,
                    end: 201
                }
            }
        }];

        it('returns correct data properly sorted', () => {
            expect(getConstructionElements({}, 'main').resultFunc(
                elements,
                scaleLinear(),
                scaleLinear(),
                'screen-0'
            )).toEqual([{
                id: 'screen-3',
                isSelected: false,
                type: 'screen',
                radius: null,
                title: 'Screen, unknown diameter, 201 - 201 undefined depth',
                thickness: 0.5,
                left: {
                    x: -6,
                    y1: 201,
                    y2: 201
                },
                right: {
                    x: 6,
                    y1: 201,
                    y2: 201
                }
            }, {
                id: 'screen-0',
                isSelected: true,
                type: 'screen',
                radius: 5,
                title: 'Screen, 10 in diameter, 100 - 200 undefined depth',
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
            }, {
                id: 'screen-1',
                isSelected: false,
                type: 'screen',
                radius: 6,
                title: 'Screen, 12 in diameter, 10 - 100 undefined depth',
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
                id: 'screen-2',
                isSelected: false,
                type: 'screen',
                radius: null,
                title: 'Screen, unknown diameter, 10 - 100 undefined depth',
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
            }]);
        });

        it('works with no elements', () => {
            expect(getConstructionElements({}, 'main').resultFunc([])).toEqual([]);
        });

        it('works with mock state', () => {
            expect(getConstructionElements(mockOpts, 'main')(
                getMockStore().getState())
            ).not.toBe(null);
        });
    });

    describe('getWellWaterLevel', () => {
        it('works', () => {
            expect(getWellWaterLevel(mockOpts, 'main').resultFunc(
                scaleLinear().range([0, 100]).domain([0, 100]),
                scaleLinear().range([0, 100]).domain([new Date('2009-10-10'),
                                                      new Date('2011-10-10')]),
                {value: new Date('2010-10-10')},
                [0, 100]
            )).toEqual({
                x: 0,
                y: 50,
                width: 100,
                height: 0
            });
        });

        it('works with a different scale, waterlevel width is calculated properly', () => {
            expect(getWellWaterLevel(mockOpts, 'main').resultFunc(
                // x dimensions
                scaleLinear().range([20, 100]).domain([20, 100]),
                // y dimensions
                scaleLinear().range([0, 100]).domain([new Date('2009-10-10'),
                                                      new Date('2011-10-10')]),
                {value: new Date('2010-10-10')},
                [0, 100]
            )).toEqual({
                x: 20,
                y: 50,
                width: 80,
                height: 0
            });
        });

        it('works with mock state', () => {
            expect(getWellWaterLevel(mockOpts, 'main')(getMockStore().getState())).not.toBe(null);
        });
    });
});
