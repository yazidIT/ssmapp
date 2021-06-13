// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
 angular.module('starter', ['ionic', 'ngCordova', 'ng-mfb', 'pascalprecht.translate', 'ngMd5', 'starter.controllers'])

.run(function($ionicPlatform, $ionicHistory, $ionicPopup, $location, $rootScope, currTranslateSvc, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      // cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
      StatusBar.hide();
    }

    // Will load main upon apps startup
    $location.path('/app/main');
    $rootScope.$apply();

    //state on html tag
    $rootScope.$state = $state;

    if (window.cordova){
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            $rootScope.appversion = version;
        });
    }

  });

  $ionicPlatform.registerBackButtonAction(function(e) {
    e.preventDefault();
    function showConfirm() {
      var lang = currTranslateSvc.getData();
      var confirmPopup = $ionicPopup.show({
        title : lang.EXITTITLE,
        template : lang.EXITMSG,
        buttons : [
          { text : 'Ok', type : 'button-positive',
            onTap : function() {
              ionic.Platform.exitApp();
            }
          },
          { text : lang.CANCEL, type : 'button-positive button-outline'}
        ]
      });
    };

    // Is there a page to go back to?
    if ($ionicHistory.backView()) {
      // Go back in history
      $ionicHistory.backView().go();
    } else {
      // This is the last page: Show confirmation popup
      showConfirm();
    }

    return false;
  }, 101);

})


.config(function($stateProvider, $compileProvider, $urlRouterProvider, $translateProvider, $ionicConfigProvider) {

  // var imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file|ionic):|data:image\//;
  // $compileProvider.imgSrcSanitizationWhitelist(imgSrcSanitizationWhitelist);

  // fix "Failed to load webpage with error: unsupported URL"
  var hrefSanitizationWhitelist = /^\s*(https?|sms|tel|geo|ftp|mailto|file|ghttps?|ms-appx-web|ms-appx|x-wmapp0|ionic):/;
  $compileProvider.aHrefSanitizationWhitelist(hrefSanitizationWhitelist);
  // sanitize the images to open ionic://localhost/ on iOS
  var imgSrcSanitizationWhitelist = /^\s*(https?|ftp|file|content|blob|ms-appx|ms-appx-web|x-wmapp0|ionic):|data:image\//;
  $compileProvider.imgSrcSanitizationWhitelist(imgSrcSanitizationWhitelist);

  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.backButton.text('Back').icon('ion-chevron-left').previousTitleText(false);

  for(lang in translations){
    $translateProvider.translations(lang, translations[lang]);
  }

  $translateProvider.preferredLanguage('en');
  // $translateProvider.useSanitizeValueStrategy( 'sanitize' );

  /**
   * routing for pages
   */
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
      }
    }
  })

  .state('app.news', {
    cache: false, //<--refresh the view every time when call this state
    url: '/news',
    views: {
      'menuContent': {
        templateUrl: 'templates/news.html',
      }
    }
  })

  .state('app.detailnews', {
    url: '/detailnews',
    views: {
      'menuContent': {
        templateUrl: 'templates/detailnews.html'
      }
    }
  })

  .state('app.equery', {
    url: '/equery',
    views: {
      'menuContent': {
        templateUrl: 'templates/equery.html'
      }
    }
  })

  .state('app.equery_ans', {
    url: '/equery_ans',
    views: {
      'menuContent': {
        templateUrl: 'templates/equery_ans.html'
      }
    }
  })

  .state('app.ecompound', {
    url: '/ecompound',
    views: {
      'menuContent': {
        templateUrl: 'templates/ecompound.html'
      }
    }
  })

  .state('app.ecompound_ans', {
    url: '/ecompound_ans',
    views: {
      'menuContent': {
        templateUrl: 'templates/ecompound_ans.html'
      }
    }
  })

  .state('app.esearch', {
    url: '/esearch',
    views: {
      'menuContent': {
        templateUrl: 'templates/esearch.html'
      }
    }
  })

  .state('app.esearch_ans', {
    url: '/esearch_ans',
    views: {
      'menuContent': {
        templateUrl: 'templates/esearch_ans.html'
      }
    }
  })

  .state('app.status308', {
    url: '/status308',
    views: {
      'menuContent': {
        templateUrl: 'templates/status308.html'
      }
    }
  })

  .state('app.status308_ans', {
    url: '/status308_ans',
    views: {
      'menuContent': {
        templateUrl: 'templates/status308_ans.html'
      }
    }
  })

  .state('app.biztrust', {
    url: '/biztrust',
    views: {
      'menuContent': {
        templateUrl: 'templates/biztrust.html'
      }
    }
  })

  .state('app.biztrust_userguide', {
    url: '/biztrust',
    views: {
      'menuContent': {
        templateUrl: 'templates/biztrust_user_guide.html'
      }
    }
  })

  .state('app.biztrust_scan', {
    url: '/biztrust_scan',
    views: {
      'menuContent': {
        templateUrl: 'templates/biztrust_scan.html'
      }
    }
  })

  .state('app.biztrust_result', {
    cache: false,
    url: '/biztrust_result',
    views: {
      'menuContent': {
        templateUrl: 'templates/biztrust_result.html'
      }
    }
  })

  .state('app.biztrust_error', {
    url: '/biztrust_error',
    views: {
      'menuContent': {
        templateUrl: 'templates/biztrust_error.html'
      }
    }
  })

  .state('app.biztrust_connection_error', {
    url: '/biztrust_connection_error',
    views: {
      'menuContent': {
        templateUrl: 'templates/biztrust_connection_error.html'
      }
    }
  })

  .state('app.contactus', {
      url: '/contactus',
      cache: false, //Close because we do duplicate data -> just simple fixing:)
      views: {
        'menuContent': {
          templateUrl: 'templates/contactus.html',
          controller: 'BrowseLink'
        }
      }
    })

  .state('app.error', {
      url: '/error',
      cache: false, //Close because we do duplicate data -> just simple fixing:)
      views: {
        'menuContent': {
          templateUrl: 'templates/error.html',
        }
      }
    });

})
 .run(function($rootScope){
      $rootScope.$on('$stateChangeStart', function(ev, toState, toParams, fromState, fromParams){

        var states = ['app.main'];

        if(states.indexOf(toState.name) > -1) {
          $rootScope.hideBar=true;
        } else {
          $rootScope.hideBar=false;
        }
    })

});
