test('test', () => {
    expect(() => require.resolve('../index.js')).not.toThrow();
});
