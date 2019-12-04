angular.module('starter.controllers', ['myServices','ngStorage'])
.constant('eVar', {
    "01":"optEntityCRegNo",
    "02":"optEntityBRegNo",
    "03":"optEntityNewIC",
    "04":"optEntityPassNo",
    "06":"optEntityCRefNo",
    "07":"optEntityOldIC",
    "08":"optEntitySecLicenseNo",
    "10":"optEntityPoliceID",
    "11":"optEntityAuditFirm",
    "12":"optEntityAuditor",
    "15":"optEntityOthers",
    "17":"optEntityArmyID",
    "ROC":"optEntityCRegNoOld",
    "ROB":"optEntityBRegNoOld",
    "LLP":"optEntityLLP",
    "ROCN":"optEntityCRegNoNew",
    "ROBN":"optEntityBRegNoNew"
})
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicHistory, $state, $ionicViewService,$ionicConfigProvider) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
//    console.log('Doing login', $scope.loginData);
    if ($scope.loginData.username === "test") {
      //$location.path("/app/main");
      window.localStorage.setItem("password", $scope.loginData.username);
      $ionicViewService.nextViewOptions({
          disableAnimate: true,
          disableBack: true
      });
      //$location.path("/protected");
      $state.go('app.news');
    }
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    //$timeout(function() {
    //  $scope.closeLogin();
    //}, 5000);
  };

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };
    
$ionicConfigProvider.backButton.previousTitleText(false);

})


.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'News & Announcements', id: 1 },
    { title: 'e-Query', id: 2 },
    { title: 'e-Compound', id: 3 },
    { title: 'e-Search', id: 4 },
    { title: 'Status 308', id: 5 },
    { title: 'Contact Us', id: 6 },
  	{ title: 'Bahasa Malaysia', id: 7 },
  	{ title: 'Main', id: 8 },
  	{ title: 'Equeer', id: 9 }
  ];
    

})

.controller('MenuCtrl', function($scope) {
  $scope.mySelect = "Company Registration Number";
  $scope.placeHolder = "Company Registration";
  $scope.processSelectValue = function(myVal) {
    //alert(myVal);
    $scope.placeHolder = myVal;
  }
})

.controller('LogoutCtrl', function($scope, $state) {
  $scope.logOut = function() {
    window.localStorage.removeItem("password");
    $state.go('login');
  }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('FloatMenuCtrl', function($scope, $state, $ionicHistory, myFmFactory,langSvc,currTranslateSvc,$rootScope) {
      $scope.goBack = function(destval) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        $scope.mfb = 'closed';
        $state.go(destval);

      };
    
    //listen to chenge at current state
    $rootScope.$on('reloadOnLanguageChange', function() {
      $scope.buttons = myFmFactory.getButtons(currTranslateSvc.getData());
    });
    
    $scope.buttons = myFmFactory.getButtons(currTranslateSvc.getData());

})

.controller('BrowseLink', function($scope, myContactUs) {

  $scope.openXLink = function(httpLink) {
    window.open(httpLink,'_system','location=yes');
  }

  $scope.openInLink = function(httpLink) {
    window.open(httpLink,'_blank');
  }
  
 
  //$scope.openCordovaWebView = function()
  //{
   // Open cordova webview if the url is in the whitelist otherwise opens in app browser
   //window.open('http://google.com','_self');
  //};

  $scope.contactlist = myContactUs.getcontactlist();
    
})

.controller("MainController",
function($scope, $cordovaDevice, $filter, $ionicPlatform, $ionicSlideBoxDelegate, $state,
        deviceAuth, newsSvc, licInfo, eQuerySvc, config,langSvc,currTranslateSvc,newsStoreSvc,$rootScope,$localStorage,popupError,$cordovaNetwork) {
/*
  if(window.localStorage.getItem("password") === "undefined" || window.localStorage.getItem("password") === null) {
    $ionicViewService.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    //$location.path("/login");
    $state.go('login');
  }
  $scope.status = "Making it this far means you are signed in";
   licInfo.start();
*/

 
 //SSMHACK
    //ORI--->
  $ionicPlatform.ready(function() {
    $scope.initDevice = function() {
      var device = $cordovaDevice.getDevice();
      deviceAuth.setUUID(device.uuid);
      deviceAuth.setPlatform($filter('lowercase')(device.platform));
      var devInfo = deviceAuth.getDevInfo();
      //alert(devInfo.devUUID + " " + devInfo.devPlatform);
      //alert(device.uuid + " " + device.platform);

    }

    $scope.initDevice();
  });

  deviceAuth.registerDevice().then(function(result) {
    $scope.devData = result.data;
    deviceAuth.setToken($scope.devData.data.token);
    $scope.dev2Data = deviceAuth.getDevInfo();
  });

  currTranslateSvc.setData(translations[langSvc.getLang()]);
    //<-- END ORI
    //< DUMMY-->
//    $scope.dev2Data = {
//        "platform":"android",
//        "token":"1aa99f13bd05e1ae836a460533a1771acddf73c5",//-->external */"9d5cc6f7c381e5e44766a3c0f740c8511ef14899",
//        "uuid": "9de21a1a1d456e5b"
//    };
//    
//    deviceAuth.setToken("1aa99f13bd05e1ae836a460533a1771acddf73c5");//*/ deviceAuth.setToken("9d5cc6f7c381e5e44766a3c0f740c8511ef14899");
//
//
//     //init lang var
//    console.log("init curr lang");
//    currTranslateSvc.setData(translations[langSvc.getLang()]);
//    
    //<--END DUMMY
    //END - SSMHACK


  function doUpdateNews(){
      var data;
      var lang = currTranslateSvc.getData();
      newsSvc.getNews(lang.MENU_01).then(
          function successCallback(result) {
            data = result.data;
            $localStorage.news = result.data;
          },function errorCallback(response) {
                data = $localStorage.news;
          })
      .finally(function(){
            $scope.userData = data.data[langSvc.getLang()];
            newsStoreSvc.setData(data.data[langSvc.getLang()]);
            $ionicSlideBoxDelegate.update();
      });
      
      setTimeout(function() {
          if (window.cordova){
            navigator.splashscreen.hide();
          }
        }, 1000);
  }
    
  doUpdateNews();
    
  $rootScope.$on('reloadOnLanguageChange', function() {
    doUpdateNews();
  });
    
  
/*
  $scope.showNews = function(content) {
    var alertPopup = $ionicPopup.alert({
      title: '<h4 class="title-assertive">News</h4>',
      template: content,
      buttons: [
        { text: '<b class="title-class">Close</b>',
          type: 'button-positive button-small',
          onTap: function(e) {
            alertPopup.close();
          }
        }
      ]
    });
  }*/

  $scope.getDetailNews = function(newsLink) {
    var lang = currTranslateSvc.getData();
    //OfflineCheck
    if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
    }
      
    //alert(newsLink);
    var queryData = {
      first : "",
      second : "",
      query : newsLink
    };
    eQuerySvc.setData(queryData);
    $state.go('app.detailnews');
  }

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  //$scope.slides = [{name:"1"},{name:"2"},{name:"3"},{name:"4"}];

  // Called each time the slide changes
  $scope.slideIndex = 0;
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    //console.log($scope.slideIndex);
  };
})

.controller('NewsCtrl', function($scope, $state, eQuerySvc, newsStoreSvc ,currTranslateSvc,$rootScope,popupError,$cordovaNetwork) {
  
  $scope.userData =newsStoreSvc.getData(); //<--already updated by main control
  $scope.getDetailNews = function(newsLink) {
    //OfflineCheck
    var lang = currTranslateSvc.getData();
    if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
    }
      
    var queryData = {
      first : "",
      second : "",
      query : newsLink
    };
    eQuerySvc.setData(queryData);
    $state.go('app.detailnews');
  }
    
    
})

.controller('DetailNewsResult', function($scope, newsSvc,currTranslateSvc) {
  var defaultData = [];
  $scope.userData = defaultData;
  var lang = currTranslateSvc.getData();
  newsSvc.getDetailNews(lang.MENU_01).then(function(result) {
    $scope.userData = result.data;
  });
})

.controller('QueryInfo', function($scope, $ionicPopup, $ionicHistory, $state, getQuery, eQuerySvc,currTranslateSvc,popupError,$cordovaNetwork) {

  $scope.placeHolder = "Comp. No / MyCoID";
  $scope.showResult = function() {
     var lang = currTranslateSvc.getData();
     //OfflineCheck
     if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
     }
     var lang = currTranslateSvc.getData();
      getQuery.loadUserData(lang.MENU_05).then(function(result) {
         if(result.status != 200){
              console.log("Error - "+result.status);
              $scope.data.input = ""; 
              return;
          }

          if(result.data.data.length == 0){
              console.log("Data empty");
              $scope.data.input = ""; 
              return;
          }
        
//          $scope.userData = result.data;
            $state.go('app.equery_ans');

      });

      $scope.queryData = eQuerySvc.getData();
  }

  $scope.searchInfo = function(data) {
    if (data === undefined ) {
      eQuerySvc.emptySearch();
    } else if (data.length == 0) {
      eQuerySvc.emptySearch();
    } else {
      var queryData = {
        first : "",
        second : "",
        query : data
      };
      eQuerySvc.setData(queryData);
      $scope.showResult();
    }
  }
})

.controller('QueryResult', function($scope, getQuery, eQuerySvc) {
   $scope.userData =getQuery.getData();
  
})

.controller('CmpndMenuCtrl', function($scope,eVar,currTranslateSvc,$rootScope) {
  $scope.input = {
    entityType :  "Company Registration No.",
    compound :    "Registrar of Companies (ROC)"
  }
//  $scope.entityType = "Company Registration No.";
//  $scope.compound = "Registrar of Companies (ROC)";
  $scope.input.entityType = "ROC";//default value
  var changePlaceHolder = function(){
        var lang = currTranslateSvc.getData();
        $scope.placeHolder = lang[eVar[$scope.input.entityType]];
  }
  
  //broadcast
  $rootScope.$on('reloadOnLanguageChange', function() {
    changePlaceHolder();
  });
  
  changePlaceHolder();
  
  $scope.cmpndData = "ROC";
  $scope.entityData = $scope.cmpndData;
    
  $scope.compoundSelect = function() {
      $scope.cmpndData = $scope.input.compound; //dont know why...huhu
  }

  $scope.entityTypeSelect = function() {
    var lang = currTranslateSvc.getData();
    $scope.placeHolder = lang[eVar[$scope.input.entityType]];
    $scope.entityData =  $scope.input.entityType;
  }
})

.controller('CompoundInfo', function($scope, $ionicPopup, $ionicHistory, $state,getCmpnd, eQuerySvc,currTranslateSvc,popupError,$cordovaNetwork) {
  
  $scope.input.compound = "ROC";
    
  $scope.showResult = function() {
      var lang = currTranslateSvc.getData();
      //OfflineCheck
     if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
     }
      
      getCmpnd.loadUserData(lang.MENU_06).then(function(result) {
      if(result.status != 200){
          console.log("Error - "+result.status);
          $scope.input.entityNo = ""; 
          return;
      }
      
      if(result.data.data.length == 0){
          console.log("Data empty");
          $scope.input.entityNo = ""; 
          return;
      }
          
           
//    $scope.userData = result.data; 
//          console.log($scope.userData);
      $state.go('app.ecompound_ans');

    });

    $scope.queryData = eQuerySvc.getData();
      
  }

  $scope.compoundInfo = function(data1, data2) {
//    console.log(data1 + " : " + data2);
    if (data1 === undefined ) {
      eQuerySvc.emptySearch();
    } else if (data1.length == 0) {
      eQuerySvc.emptySearch();
    } else {
      var entityTypeID = data2;
      var queryData = {
        first: $scope.cmpndData,
        second: entityTypeID,
        query: data1
      };
      eQuerySvc.setData(queryData);
      //alert(queryData.first + " " + queryData.second + " " + queryData.query);
      $scope.showResult();
    }
  }
})

.controller('CmpndResult', function($scope, getCmpnd, eQuerySvc) {
   $scope.userData = getCmpnd.getData();
})

.controller('BMCtrl', function($scope, $translate, langSvc,myFmFactory,currTranslateSvc,$element,$rootScope,$state,$ionicHistory) {
  $scope.langSelected = langSvc.getLang();
  $scope.ChangeLanguage = function(lang){
    $translate.use(lang);
    langSvc.setLang(lang);
    $scope.langSelected = lang;
      
      //set scope variable & refresh floating
      currTranslateSvc.setData(translations[langSvc.getLang()]);
      myFmFactory.getButtons(currTranslateSvc.getData());
      
      //reload all related placeHolder by broadcast on other controller
      $rootScope.$broadcast('reloadOnLanguageChange');
      
      //clear cache and go to main
//      $ionicHistory.clearCache().then(function(){$state.go('app.main');});
      $state.go('app.main');//just simple go
  }
})

.controller('SearchInfo', function($scope, $window, $ionicPopup, $ionicHistory, $state, eQuerySvc,getSearch,currTranslateSvc,popupError,$cordovaNetwork) {
    
  $scope.input.entityType = "ROC";

  $scope.showResult = function() {
     var lang = currTranslateSvc.getData();
    //OfflineCheck
     if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
     }
   
    getSearch.loadUserData(lang.MENU_07).then(function(result) {

     if(result.status != 200){
          console.log("Error - "+result.status);
          $scope.input.entityNo = ""; 
          return;
      }
      
      if(result.data.data.length == 0){
          console.log("Data empty");
          $scope.input.entityNo = ""; 
          return;
      }
        
      $state.go('app.esearch_ans');
          
    });

    $scope.queryData = eQuerySvc.getData();
    
  }

  $scope.searchInfo = function(data) {
    //alert($scope.entityData + " : " + data);
//      console.log($scope);
    if (data === undefined ) {
      eQuerySvc.emptySearch();
    } else if (data.length == 0) {
      eQuerySvc.emptySearch();
    } else {
      var queryData = {
        first: $scope.entityData,
        query: data
      };
      eQuerySvc.setData(queryData);
      //alert(queryData.first + " " + queryData.query);
      $scope.showResult();
    }
  }

  $window.OpenLink = function(link) {
    window.open( link, '_system');
  };
    
})

.controller('SearchResult', function($scope, getSearch, eQuerySvc) {
    $scope.userData = getSearch.getData();
//    console.log(getSearch.getData());
})

.controller('S308Info', function($scope, $ionicPopup, $ionicHistory, $state, eQuerySvc,currTranslateSvc,getS308,$rootScope,popupError,$cordovaNetwork) {
    
  var changePlaceHolder = function(){
        var lang = currTranslateSvc.getData();
        $scope.placeHolder = lang.placeHolderS308;
  }
  
  //broadcast
  $rootScope.$on('reloadOnLanguageChange', function() {
    changePlaceHolder();
  });
  
  changePlaceHolder();

  
    
  $scope.showResult = function() {
    var lang = currTranslateSvc.getData();
    //OfflineCheck
    if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
    }
    
    getS308.loadUserData(lang.MENU_08).then(function(result) {
        if(result.status != 200){
          console.log("Error - "+result.status);
          $scope.data.input = ""; 
          return;
      }
      
      if(result.data.data.length == 0){
          console.log("Data empty");
          $scope.data.input = ""; 
          return;
      }
    
        $state.go('app.status308_ans');

    });

    $scope.queryData = eQuerySvc.getData();
  }

  $scope.s308Info = function(data) {
    //alert(data);
    if (data === undefined ) {
      eQuerySvc.emptySearch();
    } else if (data.length == 0) {
      eQuerySvc.emptySearch();
    } else {
      var queryData = {
        query: data
      };
      eQuerySvc.setData(queryData);
      //alert(queryData.query);
      $scope.showResult();
    }
  }
})

.controller('S308Result', function($scope, getS308, eQuerySvc) {
    $scope.userData = getS308.getData();
})

.controller('ContactUs', function($scope, SSMOfficesService,$cordovaGeolocation,langSvc,$rootScope,$localStorage) {
    
    $scope.contactIsEmpty=true;
    viewContacts = function(defaultId){
        //store the original offices data since we just use simple method on
        //changing name by language then listen to restore pure data because
        //we have modify the data on state.
         ($scope.offices).forEach(function(office){
             if(langSvc.getLang()!=="en"){
                 office.placeHolderName = office.nameMs;
             }else{
                 office.placeHolderName = office.name;
             }

        });


        $scope.contactIsEmpty=false;

        var defaultOffice = $scope.offices[0];
        
        if(defaultId !== undefined) 
            defaultOffice = $scope.offices[defaultId];

        $scope.selectedOption = defaultOffice;
        //alert("Get list");

        //Map
        var latLng = new google.maps.LatLng(defaultOffice.location.lat, defaultOffice.location.long);

        var mapOptions = {
          center: latLng,
          zoom: 15,
          streetViewControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

         $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
         $scope.myHtmlAddr= $scope.selectedOption.address;
         $scope.myHtmlTel= $scope.selectedOption.tel;
         $scope.myHtmlFax= $scope.selectedOption.fax;

         if(langSvc.getLang()!=="en"){
              $scope.myHtmlOperation= $scope.selectedOption.operationHourMs;
         }else{
              $scope.myHtmlOperation= $scope.selectedOption.operationHour;
         }


        function setMarker(data) {
            //Remove previous Marker.
            if ($scope.marker != null) {
                $scope.marker.setMap(null);
            }

            var latLng = new google.maps.LatLng(data.location.lat, data.location.long);
            $scope.map.panTo(latLng);

            $scope.marker = new google.maps.Marker({
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              position: latLng
            });  

            var infoWindow = new google.maps.InfoWindow({
              content: 'SSM '+data.name
            });

            google.maps.event.addListener($scope.marker, 'click', function () {
                  infoWindow.open($scope.map, $scope.marker);
              });

            infoWindow.open($scope.map, $scope.marker);
            $scope.myHtmlAddr= $scope.selectedOption.address;

            if(langSvc.getLang()!=="en"){
                 $scope.myHtmlOperation= $scope.selectedOption.operationHourMs;
             }else{
                  $scope.myHtmlOperation= $scope.selectedOption.operationHour;
             }

             $scope.myHtmlTel= $scope.selectedOption.tel;
             $scope.myHtmlFax= $scope.selectedOption.fax;


        };



        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
            setMarker(defaultOffice);
        });

        $scope.changeMarker = function(){
            setMarker($scope.selectedOption);
        }


        $scope.trustAsHtml = function(html) {
          return $sce.trustAsHtml(html);
        }

        $scope.gotoLocation = function(){
             window.open('http://maps.google.com?q='+$scope.selectedOption.location.lat + "," + $scope.selectedOption.location.long,'_system','location=yes');
        }

        $scope.call = function(){
    //        alert($scope.selectedOption.mainTel);
            window.open('tel:'+$scope.selectedOption.mainTel.replace(/\s/g,''),'_system');
        }

        $scope.email = function(){
            window.open('mailto:'+$scope.selectedOption.email.replace('[at]','@'),'_system','location=yes');
        }
    };
    
    
    
    //default data
    
    defaultTel = {
                //default as 2017
                "tel":"+60322994400",
			  	"fax":"+0322994411"
            };

    $scope.generalLine = defaultTel;
    
    if($localStorage.generalLine !== undefined){
        $scope.generalLine = $localStorage.generalLine;
    }

    if($localStorage.contactList !== undefined){
            $scope.offices = $localStorage.contactList;
            viewContacts();
    }
    
  
    SSMOfficesService.list().then(function(result) {
        //store general data
        if(result.data.data.generalLine !== undefined){
            $localStorage.generalLine= result.data.data.generalLine;
            $scope.generalLine = $localStorage.generalLine;
        }
        
        
        officesData = result.data.data.offices;
         
        //empty
        if(officesData == undefined || officesData.length == 0){
             return;
        }

        //store offices data
        if(officesData !== undefined && officesData.length !== 0){
            $scope.offices = officesData;
            $localStorage.contactList = $scope.offices;
        }
        
       
        viewContacts(result.data.data.defaultId);
       
    });

    
   
});
//.filter('unsafe', function ($sce) { //<---dangerous for xss
//    return function (val) {
//        return $sce.trustAsHtml(val);
//    }
//});
