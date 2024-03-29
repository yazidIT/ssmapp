// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
 angular.module('starter', ['ionic', 'ngCordova', 'ng-mfb', 'pascalprecht.translate', 'starter.controllers'])
 
.run(function($ionicPlatform, $ionicHistory, $ionicPopup, $location, $rootScope, currTranslateSvc,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {

  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'templates/mainlogin.html',
    controller: 'AppCtrl'
  })

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    //controller: 'AppCtrl'
  })

  .state('app.main', {
    url: '/main',
    views: {
      'menuContent': {
        templateUrl: 'templates/main.html',
        //controller: 'MainController'
      }
    }
  })

  .state('app.news', {
    cache: false, //<--refresh the view every time when call this state
    url: '/news',
    views: {
      'menuContent': {
        templateUrl: 'templates/news.html',
        //controller: 'NewsCtrl'
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

  .state('app.bahasamalaysia', {
      url: '/bahasamalaysia',
      views: {
        'menuContent': {
          templateUrl: 'templates/bahasamalaysia.html',
          controller: 'BMCtrl'
        }
      }
    })
  
  .state('app.error', {
      url: '/error',
      cache: false, //Close because we do duplicate data -> just simple fixing:) 
      views: {
        'menuContent': {
          templateUrl: 'templates/error.html',
//          controller: 'BrowseLink'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  //$urlRouterProvider.otherwise('/home');

  for(lang in translations){
    $translateProvider.translations(lang, translations[lang]);
  }

  $translateProvider.preferredLanguage('en');
})
 .run(function($rootScope){
      $rootScope.$on('$stateChangeStart', function(ev, toState, toParams, fromState, fromParams){

        var states = ['app.main'];
          
        if(states.indexOf(toState.name) > -1) {
//            console.log('OK');
          $rootScope.hideBar=true;
        } else {
          $rootScope.hideBar=false;
        }
    })
 
});
