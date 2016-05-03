requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        controller: '../controller'
    }
});

// Start the main app logic.
requirejs(
    [
    'resize',
    'keyboard',
    'dictionary',
    'config',
    'cookies',
    'utils',
    'input_masks',
    'controller/signin',
    'controller/business',
    'controller/customer',
    'controller/sale',
    'controller/global'
    ]
    // ,
    // function (resize, controller) {
    // }
);
