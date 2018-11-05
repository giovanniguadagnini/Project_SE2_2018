const dup = require('./someModule').dup


test('dup_num test', () => {
    expect(dup(2)).toBe(4);
});

test('dup_undefined test', () => {
    expect(dup(undefined)).toBe(NaN);
});
