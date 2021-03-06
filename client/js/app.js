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
    'controller/global',
    'resize',
    'keyboard',
    'dictionary',
    'config',
    'cookies',
    'utils',
    'input_masks',
    'typeahead',
    'controller/menu',
    'controller/signin',
    'controller/business',
    'controller/navbar',
    'controller/entries',
    'controller/customers',
    'controller/customer',
    'controller/sale',
    'controller/entry',
    'controller/entries',
    'controller/accounts',
    'controller/ledger'
    ]
    // ,
    // function (resize, controller) {
    // }
);
