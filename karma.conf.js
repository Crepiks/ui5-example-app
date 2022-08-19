module.exports = function (config) {
    config.set({
        frameworks: ['ui5', 'qunit', 'sinon'],
        ui5: {
            url: 'https://sapui5.hana.ondemand.com',
            mode: 'script',
            config: {
                async: false,
                resourceRoots: {
                    'me.sayazhan.ui5-example-app': '/base/webapp/',
                },
            },
            tests: [
                'me/sayazhan/ui5-example-app/test/integration/AllJourneys',
                'me/sayazhan/ui5-example-app/test/unit/AllTests',
            ]
        },
        customLaunchers: {
            ChromeHeadlessCustom: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-gpu'],
            },
        },
        browsers: ['Chrome'],
        preprocessors: {
            'webapp/!(test|mocks)/**/*.js': ['coverage'],
        },
        concurrency: 0,
        coverageReporter: {
            includeAllSources: true,
            reporters: [
                {
                    type: 'lcov',
                    dir: 'coverage',
                    subdir: '.'
                },
                {
                    type: 'text'
                }
            ]
        },
        reporters: ['progress', 'coverage']
    });
};
