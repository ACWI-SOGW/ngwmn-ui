import { callIf } from './utils';


describe('Utils module', () => {
    describe('callIf', () => {
        let spy;

        beforeEach(() => {
            spy = jasmine.createSpy('callIf');
        });

        it('calls on true', () => {
            callIf(true, spy)();
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();
        });

        it('calls on true with arguments', () => {
            callIf(true, spy)(1, 2, 3);
            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(1, 2, 3);
        });

        it('no-ops on false', () => {
            callIf(false, spy)();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
