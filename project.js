module.exports = function (env) {
    /**
     * react paths
     */
    var reactjsPaths = [
        'node_modules/react/umd/react.development.js',
        'node_modules/react-dom/umd/react-dom.development.js'
    ];
    var reactminjsPaths = [
        'node_modules/react/umd/react.production.min.js',
        'node_modules/react-dom/umd/react-dom.production.min.js'
    ];

    function jsPath(path) {
        return 'js/' + path;
    }
    /**
     * shimjs paths
     */
    var shimjsPaths = [
        'node_modules/es5-shim/es5-shim.js',
        'node_modules/es5-shim/es5-sham.js',
        'node_modules/es6-shim/es6-shim.js',
        'libs/es6-sham.js',
        'node_modules/es7-shim/dist/es7-shim.js',
    ];

    var baiduAK = 'cS4A2VNIIcgeHXuY0tZhMA7hqj9x2PUj';
    return {
        /*
        * whether should use compass to complie scss
        * default is true,you can change the value false if you don't want to use compass.
        */
        compass:true,
        /*
        * if compass is true,it will use this dir as its compile dir
        */
        scssDIR:'scss',
        /**
         * asset dir ,all file in asset dir will be move to dist dir
         * you can put fonts、images and other static file to the asset dir
         */
        assetDIR:'asset',
        /**
         * all the js will use gulp-concat to join.
         */
        commonJS: {
            /**
             * react js,usually,we don't use webpack to pack the reactjs;
             */
            react: env == 'dev' ? reactjsPaths : reactminjsPaths,
            /**
             * shim js,you can commet it if you don't need shim js.
             */
            shim:shimjsPaths
        },
        /**
         * project build config 
         * you can add other property or other release env
         */
        buildConfig:{
            /**
             * default build config 
             */
            defaultConfigs:{
                project:'lexiao'
            },
            /**
             * different release type will use different config
             */
            dev:{
                ENV:'dev',
                API_CONTEXT:'/api'
            },
            ft:{
                ENV:'ft',
                API_CONTEXT:'/api'
            },
            uat:{
                ENV:'uat',
                API_CONTEXT:'/api'
            },
            prod:{
                ENV:'prod',
                API_CONTEXT:'/api'
            }
        },
         /**
         * use webpack to package js
         */
        webpackEntry:{
            index:'./js/views',
        },
        /**
         * html pages
         */
        pages: [
            {
                title: '乐消',
                baiduAK:baiduAK,
                template: 'templates/template.html',
                output: 'index.html',
                js: ['shim.js','react.js','index.js'],
                css: ['common.css'],
                prerender:false
            },
        ]
    }
}