angular.module('starter.controllers', ['myServices','ngStorage'])

/**
 * constants mostly for E-compound search parameters
 */
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
    "ROCNEW":"optEntityCRegNoNew",
    "ROBNEW":"optEntityBRegNoNew"
})

.controller('AppCtrl', function($scope, $ionicModal, $ionicHistory, $state, $ionicViewService, $ionicConfigProvider) {

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
    if ($scope.loginData.username === "test") {
      window.localStorage.setItem("password", $scope.loginData.username);
      $ionicViewService.nextViewOptions({
          disableAnimate: true,
          disableBack: true
      });
      $state.go('app.news');
    }
  };

  $scope.goBack = function(){
    $ionicHistory.goBack();
  };

  $ionicConfigProvider.backButton.previousTitleText(false);
})


/***
 * General utility controller
 */
.controller('MenuCtrl', function($scope) {
  $scope.mySelect = "Company Registration Number";
  $scope.placeHolder = "Company Registration";
  $scope.processSelectValue = function(myVal) {
    $scope.placeHolder = myVal;
  }
})

.controller('LogoutCtrl', function($scope, $state) {
  $scope.logOut = function() {
    window.localStorage.removeItem("password");
    $state.go('login');
  }
})

.controller('FloatMenuCtrl', function($scope, $state, $ionicHistory, myFmFactory, currTranslateSvc, $rootScope) {
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

.controller('CustomNavi', function($scope, $ionicHistory, $state) {

  $scope.goBack = function(){
    var v = $ionicHistory.viewHistory();
    if(!v.backView){
        $state.go('app.main');
    }
    else{
        $ionicHistory.goBack();
    }
  };

  $scope.goTo = function(target){
    $state.go(target);
  };
})

/***
 * click on url link on pages
 */
.controller('BrowseLink', function($scope, myContactUs) {

  $scope.openXLink = function(httpLink) {
    console.log("OpenXLink called: " + httpLink);
    cordova.InAppBrowser.open(httpLink,'_system','location=yes');
  }

  $scope.openInLink = function(httpLink) {
    cordova.InAppBrowser.open(httpLink,'_blank');
  }

  $scope.contactlist = myContactUs.getcontactlist();
})

.controller("MainController", function($scope, $cordovaDevice, $filter, $ionicPlatform, $ionicSlideBoxDelegate, $state,
            deviceAuth, newsSvc, eQuerySvc, langSvc, currTranslateSvc, newsStoreSvc, $rootScope, $localStorage, popupError,
            $cordovaNetwork) {

 //SSMHACK
    //ORI--->
  $ionicPlatform.ready(function() {
    $scope.initDevice = function() {
      var device = $cordovaDevice.getDevice();
      deviceAuth.setUUID(device.uuid);
      deviceAuth.setPlatform($filter('lowercase')(device.platform));
      var devInfo = deviceAuth.getDevInfo();
    }

    $scope.initDevice();
  });

  deviceAuth.registerDevice().then(function(result) {
    $scope.devData = result.data;
    deviceAuth.setToken($scope.devData.token);
    $scope.dev2Data = deviceAuth.getDevInfo();
    doUpdateNews();
  });

  currTranslateSvc.setData(translations[langSvc.getLang()]);

  function doUpdateNews(){
      var data;
      var lang = currTranslateSvc.getData();
      newsSvc.getNews(lang.MENU_01).then(
          function successCallback(result) {
            data = result.data.channel.item;
            $localStorage.news = data;
          }, function errorCallback(response) {
            data = $localStorage.news;
          })
      .finally(function(){
            $scope.userData = data;
            newsStoreSvc.setData(data);
            $ionicSlideBoxDelegate.update();
      });

      setTimeout(function() {
          if (window.cordova){
            navigator.splashscreen.hide();
          }
        }, 1000);
  }

  $rootScope.$on('reloadOnLanguageChange', function() {
    doUpdateNews();
  });

  $scope.getDetailNews = function(newsLink) {
    var lang = currTranslateSvc.getData();
    //OfflineCheck
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

  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };

  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };

  // Called each time the slide changes
  $scope.slideIndex = 0;
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
})

/**
 * RSS news feed
 */
.controller('NewsCtrl', function($scope, $state, eQuerySvc, newsStoreSvc, currTranslateSvc, popupError, $cordovaNetwork) {

  $scope.userData = newsStoreSvc.getData(); //<--already updated by main control
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

/**
 * detail news page
 */
.controller('DetailNewsResult', function($scope, newsSvc, currTranslateSvc) {

  var defaultData = [];
  $scope.userData = defaultData;
  $scope.detailNews = defaultData;
  var lang = currTranslateSvc.getData();
  newsSvc.getDetailNews(lang.MENU_01).then(function(result) {
    $scope.detailNews = result.data;
  });
})

/**
 * E-query main controller
 */
.controller('QueryInfo', function($scope, $state, getQuery, eQuerySvc, currTranslateSvc,
            popupError, $cordovaNetwork, getSearch) {

  $scope.placeHolder = "Comp. No / MyCoID";

  $scope.showResult = function() {
      var lang = currTranslateSvc.getData();
      //OfflineCheck
      if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
      }

      // 1. Get companyNo result from api v2 esearch
      // 2. Use (1) to search document
      var queryData1 = eQuerySvc.getData();
      queryData1.first = "ROC";
      eQuerySvc.setData(queryData1);
      getSearch.loadUserData(lang.MENU_05).then(function(result) {
          if(result.status != 200){
              console.log("Error - " + result.status);
              $scope.data.input = "";
              return;
          }
          if(result.length == 0){
              console.log("Data empty");
              $scope.input.entityNo = "";
              return;
          }
          console.log(JSON.stringify(result));
          var comRegNo = result.data.result.companyNo;
          console.log(comRegNo);

          queryData1.query = comRegNo;
          eQuerySvc.setData(queryData1);

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

              $state.go('app.equery_ans');

          });

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

  // $scope.entityTypeSelect = function() {
  //   var lang = currTranslateSvc.getData();
  //   $scope.placeHolder = lang[eVar[$scope.input.entityType]];
  //   $scope.entityData =  $scope.input.entityType;
  //   console.log($scope.input.entityType);
  // }
})

/**
 * utility controller for result
 */
.controller('QueryResult', function($scope, getQuery, dateUtil, currTranslateSvc, docCode) {

  var userData = getQuery.getData();
  var lang = currTranslateSvc.getData();
  var docNameLibrary;

  docCode.loadDocumentDictionary().then( data => {

    console.log(JSON.stringify(data.data));
    docNameLibrary = data.data;

    userData.documents.forEach(function(arrayItem) {

      console.log(JSON.stringify(arrayItem));

      //  if(arrayItem.document === '557')
      //     arrayItem.document = lang.DOC_557;
      //  else if(arrayItem.document === '559')
      //     arrayItem.document = lang.DOC_559;

      var docCodeNumber = arrayItem.document;
      arrayItem.document = docNameLibrary[arrayItem.document];
      if(arrayItem.document === undefined) {
        arrayItem.document = docCodeNumber;
      }

      if(arrayItem.documentDate !== '-' && arrayItem.documentDate !== '') {
        arrayItem.documentDate = dateUtil.getDateNonStandard(arrayItem.documentDate);
      }

      if(arrayItem.queryDate !== '-' && arrayItem.queryDate !== '') {
        arrayItem.queryDate = dateUtil.getDateNonStandard(arrayItem.queryDate);
      }

      if(arrayItem.rejectDate !== '-' && arrayItem.rejectDate !== '') {
        arrayItem.rejectDate = dateUtil.getDateNonStandard(arrayItem.rejectDate);
      }

      if(arrayItem.status === 'A')
        arrayItem.status = lang.STAT_APPROVE;
      else if(arrayItem.status === 'T')
        arrayItem.status = lang.STAT_AUTOREJECT;
      else if(arrayItem.status === 'Q')
        arrayItem.status = lang.STAT_QUERY;
      else if(arrayItem.status === 'B')
        arrayItem.status = lang.STAT_BUSINESS;
      else if(arrayItem.status === 'C')
        arrayItem.status = lang.STAT_DISSOLVED;
      else if(arrayItem.status === 'D')
        arrayItem.status = lang.STAT_REMOVE;

      console.log(JSON.stringify(arrayItem));
    })

     $scope.userData = userData;

  })

})

/**
 * Control E-compound menu selection changes
 */
.controller('CmpndMenuCtrl', function($scope, eVar, currTranslateSvc, $rootScope) {
  $scope.input = {
    entityType :  "01",
    compound :    "ROC"
  }

  var changePlaceHolder = function(){
        var lang = currTranslateSvc.getData();
        $scope.placeHolder = lang[eVar[$scope.input.entityType]];
  }

  // listen to broadcast
  $rootScope.$on('reloadOnLanguageChange', function() {
    changePlaceHolder();
  });

  changePlaceHolder();

  $scope.entityData = $scope.input.compound;
  $scope.cmpndData = $scope.input.compound;
  $scope.compoundSelect = function() {
      $scope.cmpndData = $scope.input.compound; //dont know why...huhu
  }

  $scope.entityTypeSelect = function() {
    var lang = currTranslateSvc.getData();
    $scope.placeHolder = lang[eVar[$scope.input.entityType]];
    $scope.entityData =  $scope.input.entityType;
    console.log($scope.input.entityType);
  }
})

/**
 * E-compound
 */
.controller('CompoundInfo', function($scope, $state, getCmpnd, eQuerySvc, currTranslateSvc, popupError,
                                      $cordovaNetwork, getSearch) {

    $scope.showResult = function() {
        var lang = currTranslateSvc.getData();
        //OfflineCheck
        if(window.cordova && $cordovaNetwork.isOffline()){
            popupError.noInternet(lang.ERROR_TITLE);
            return;
        }

        // For Company Regisration
        var queryDataFromUser = eQuerySvc.getData();
        console.log("queryData ===> " + JSON.stringify(queryDataFromUser));

        if(queryDataFromUser.second === "01") {

            queryDataFromUser.first = "ROC";
            eQuerySvc.setData(queryDataFromUser);

              getCmpnd.loadUserData(lang.MENU_06).then(function(result) {
                if(result.status != 200){
                    console.log("Error - " + result.status);
                    $scope.input.entityNo = "";
                    return;
                }

                if(result.data.data.length == 0){
                    console.log("Data empty");
                    $scope.input.entityNo = "";
                    return;
                }

                $state.go('app.ecompound_ans');
              });

        } else if(queryDataFromUser.second === "02") {

            queryDataFromUser.first = "ROB";
            eQuerySvc.setData(queryDataFromUser);

              getCmpnd.loadUserData(lang.MENU_06).then(function(result) {
                if(result.status != 200){
                    console.log("Error - " + result.status);
                    $scope.input.entityNo = "";
                    return;
                }

                if(result.data.data.length == 0){
                    console.log("Data empty");
                    $scope.input.entityNo = "";
                    return;
                }

                $state.go('app.ecompound_ans');
              });

        } else {

            getCmpnd.loadUserData(lang.MENU_06).then(function(result) {
                if(result.status != 200){
                    console.log("Error - " + result.status);
                    $scope.input.entityNo = "";
                    return;
                }

                if(result.data.data.length == 0){
                    console.log("Data empty");
                    $scope.input.entityNo = "";
                    return;
                }

                $state.go('app.ecompound_ans');
            });
        }

        $scope.queryData = eQuerySvc.getData();
    }

    $scope.compoundInfo = function(data1, data2) {

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
            $scope.showResult();
        }
    }
})

.controller('CmpndResult', function($scope, getCmpnd) {
   $scope.userData = getCmpnd.getData();
})

/**
 * Language selection
 */
.controller('BMCtrl', function($scope, $translate, langSvc, myFmFactory, currTranslateSvc, $rootScope, $state) {
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

    $state.go('app.main');//just simple go
  }
})

/**
 * E-search
 */
.controller('SearchInfo', function($scope, $window, $state, eQuerySvc, getSearch, currTranslateSvc, popupError, $cordovaNetwork,
  $cordovaBarcodeScanner) {

    if($scope.input === undefined)
      console.log('$scope.input undefined');
    else
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

      if($scope.input !== undefined && $scope.input.entityType === "LLP") {
        if(result.length == 0) {
          console.log("Data empty");
          $scope.input.entityNo = "";
          return;
        }

      } else {
        if(result.data.result === undefined || result.length == 0){
          console.log("Data empty");
          $scope.input.entityNo = "";
          return;
        }
      }

      $state.go('app.esearch_ans');

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
        first: $scope.entityData,
        query: data
      };
      eQuerySvc.setData(queryData);
      $scope.showResult();
    }
  }

  $window.OpenLink = function(link) {
    cordova.InAppBrowser.open( link, '_system');
  };

  $scope.scanQR = function() {

    console.log("Scan QR ....");
    var permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.CAMERA, function( status ){

      if ( status.hasPermission ) {
        startQRScan();
      }

      else {

        permissions.requestPermission(permissions.CAMERA, function(status){
          if( status.hasPermission )
            startQRScan();
        })
      }
    });

  }

  var startQRScan = function() {

    $cordovaBarcodeScanner.scan().then(function(imageData) {
        popupError.generalAlert("E-Search QR Scanner", imageData.text);
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
        searchInfoQR("112233");
    }, function(error) {
        console.log("An error happened -> " + error);
    });
  }

  var searchInfoQR = function(data) {

      var queryData = {
        first: "ROC",
        query: data
      };
      eQuerySvc.setData(queryData);
      $scope.showResult();

  }

})

.controller('SearchResult', function($scope, getSearch, currTranslateSvc, dateUtil) {
    $scope.userData = getSearch.getData();
    $scope.entityStatus = "";
    $scope.todayDate = "";
    $scope.asAtDate = "";

    var lang = currTranslateSvc.getData();
    var status = "";
    var dtaDate = "";

    var resultData = $scope.userData;
    $scope.todayDate = dateUtil.getDateMsFormat(new Date())

    if(resultData.llpEntry !== undefined) {
      status = resultData.llpEntry.llpStatus;
      if(resultData.llpEntry.findGSTRegNoList.GSTRegNo !== undefined)
        dtaDate = resultData.llpEntry.findGSTRegNoList.GSTRegNo.dtasofdate;
    } else if(resultData.result.comStatus !== undefined) {
      status = resultData.result.comStatus;
      if(resultData.result.findGSTRegNoList.GSTRegNo !== undefined)
        dtaDate = resultData.result.findGSTRegNoList.GSTRegNo.dtasofdate;
    } else if(resultData.result.bizStatus !== undefined) {
      status = resultData.result.bizStatus;
      if(resultData.result.findGSTRegNoList.GSTRegNo !== undefined)
        dtaDate = resultData.result.findGSTRegNoList.GSTRegNo.dtasofdate;
    }

    if(dtaDate.length != 0) {
      $scope.asAtDate = dateUtil.getDateMsFormat(new Date(dtaDate));
    }

    if(status === "A")
      $scope.entityStatus = lang.STAT_ACTIVE;
    else if(status === "E")
      $scope.entityStatus = lang.STAT_EXISTING;
    else if(status === 'W' || status === 'M')
      $scope.entityStatus = lang.STAT_WINDINGUP;
    else if(status === 'D')
      $scope.entityStatus = lang.STAT_DISSOLVED;
    else if(status === 'R')
      $scope.entityStatus = lang.STAT_REMOVE;
    else if(status === 'C')
      $scope.entityStatus = lang.STAT_CEASEDBUSINESS;
    else if(status === 'X')
      $scope.entityStatus = lang.STAT_NULLVOIDCOURT;
    else if(status === 'B')
      $scope.entityStatus = lang.STAT_DISSOLVEDCONVERSIONLLP;
    else if(status === 'Y')
      $scope.entityStatus = lang.STAT_STRUKOFFWINDUPCOURT;
    else if(status === 'L')
      $scope.entityStatus = lang.STAT_EXPIRED;
    else if(status === 'T')
      $scope.entityStatus = lang.STAT_TERMINATED;
    else if(status === 'S')
      $scope.entityStatus = lang.STAT_STRIKEOFF;
    else if(status === 'CW')
      $scope.entityStatus = lang.STAT_WINDUPCOURT;
    else if(status === 'VW')
      $scope.entityStatus = lang.STAT_WINDUPVOLUNTARY;
    else if(status === 'ES')
      $scope.entityStatus = lang.STAT_STRIKINGOFF;
    else if(status === 'EV')
      $scope.entityStatus = lang.STAT_WINDINGUPVOLUNTARY;
    else if(status === 'EC')
      $scope.entityStatus = lang.STAT_WINDINGUPCOURT;
})

/**
 * S-308
 */
.controller('S308Info', function($scope, $state, eQuerySvc, currTranslateSvc, getS308, $rootScope,
            popupError, $cordovaNetwork) {

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

      var queryData1 = eQuerySvc.getData();
      queryData1.first = "ROC";
      eQuerySvc.setData(queryData1);

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

    if (data === undefined ) {
      eQuerySvc.emptySearch();
    } else if (data.length == 0) {
      eQuerySvc.emptySearch();
    } else {
      var queryData = {
        query: data
      };
      eQuerySvc.setData(queryData);
      $scope.showResult();
    }
  }
})

.controller('S308Result', function($scope, getS308, dateUtil) {
    $scope.userData = getS308.getData();
    $scope.userCos = getS308.getCos();
    var notices = $scope.userData.notices[0];
    console.log(JSON.stringify(notices));

    $scope.dateNotice1 = "-";
    $scope.dateNotice2 = "-";
    $scope.nfaDate = "-";
    $scope.dateNotice4 = "-";
    $scope.gazzetteDate2 = "-";

    if(notices.dateNotice1 !== '' && notices.dateNotice1 !== '-')
      $scope.dateNotice1 = dateUtil.getDateNonStandard(notices.dateNotice1);
    if(notices.dateNotice2 !== '' && notices.dateNotice2 !== '-')
      $scope.dateNotice2 = dateUtil.getDateNonStandard(notices.dateNotice2);
    if(notices.nfaDate !== '' && notices.nfaDate !== '-')
      $scope.nfaDate = dateUtil.getDateNonStandard(notices.nfaDate);
    if(notices.dateNotice4 !== '' && notices.dateNotice4 !== '-')
      $scope.dateNotice4 = dateUtil.getDateNonStandard(notices.dateNotice4);
    if(notices.gazzetteDate2 !== '' && notices.gazzetteDate2 !== '-')
      $scope.gazzetteDate2 = dateUtil.getDateNonStandard(notices.gazzetteDate2);
})

/**
 * QR Scanner
 */
.controller("QRScan", function($scope, $cordovaBarcodeScanner) {

  $scope.scanQR = function() {

    console.log("Scan QR ....");
    var permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.CAMERA, function( status ){

      if ( status.hasPermission ) {
        startQRScan();
      }

      else {

        permissions.requestPermission(permissions.CAMERA, function(status){
          if( status.hasPermission )
            startQRScan();
        })
      }
    });

  }

  var startQRScan = function() {

    $cordovaBarcodeScanner.scan().then(function(imageData) {
        alert(imageData.text);
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);
    }, function(error) {
        console.log("An error happened -> " + error);
    });
  }

})

/**
 * Office location
 */
.controller('ContactUs', function($scope, langSvc, contactData, $localStorage) {

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

        $scope.contactIsEmpty = false;

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
         $scope.myHtmlAddr = $scope.selectedOption.address;
         $scope.myHtmlTel = $scope.selectedOption.tel;
         $scope.myHtmlFax = $scope.selectedOption.fax;

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
            $scope.myHtmlAddr = $scope.selectedOption.address;

            if(langSvc.getLang()!=="en"){
                 $scope.myHtmlOperation= $scope.selectedOption.operationHourMs;
             }else{
                  $scope.myHtmlOperation= $scope.selectedOption.operationHour;
             }

             $scope.myHtmlTel = $scope.selectedOption.tel;
             $scope.myHtmlFax = $scope.selectedOption.fax;
        };

        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
            setMarker(defaultOffice);
        });

        $scope.changeMarker = function(){
            console.log(JSON.stringify($scope.selectedOption))
            setMarker($scope.selectedOption);
        }

        $scope.trustAsHtml = function(html) {
          return $sce.trustAsHtml(html);
        }

        $scope.gotoLocation = function(){
          cordova.InAppBrowser.open('https://maps.google.com?q='+$scope.selectedOption.location.lat + "," + $scope.selectedOption.location.long,'_system','location=yes');
        }

        $scope.call = function(){
          cordova.InAppBrowser.open('tel:'+$scope.selectedOption.mainTel.replace(/\s/g,''),'_system');
        }

        $scope.email = function(){
          cordova.InAppBrowser.open('mailto:'+$scope.selectedOption.email.replace('[at]','@'),'_system','location=yes');
        }
    };

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

    contactData.loadContactData().then(function(result) {

        //store general data
        if(result.data.data.generalLine !== undefined){
            $localStorage.generalLine = result.data.data.generalLine;
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

})

/**
 * BizTrust
 */
.controller('BizTrustCtrl', function($scope, $window, getBizTrust, $state, eQuerySvc, currTranslateSvc, popupError, $cordovaNetwork,
  $cordovaBarcodeScanner) {

  $window.OpenLink = function(link) {
    cordova.InAppBrowser.open( link, '_system');
  };

  $scope.scanQR = function() {

    console.log("Scan QR ....");
    var permissions = cordova.plugins.permissions;

    permissions.checkPermission(permissions.CAMERA, function( status ){

      if ( status.hasPermission ) {
        startQRScan();
      }

      else {

        permissions.requestPermission(permissions.CAMERA, function(status){
          if( status.hasPermission )
            startQRScan();
        })
      }
    });

  }

  var startQRScan = function() {

    $cordovaBarcodeScanner.scan().then(function(imageData) {

        console.log("QR Code Data -> " + imageData.text);
        console.log("Barcode Format -> " + imageData.format);
        console.log("Cancelled -> " + imageData.cancelled);

        var qrcodeData = eQuerySvc.getData();
        qrcodeData.first = imageData.text;
        eQuerySvc.setData(qrcodeData);
        showResult();
    }, function(error) {
        console.log("An error happened -> " + error);
    });
  }

  var showResult = function() {
    var lang = currTranslateSvc.getData();
    //OfflineCheck
    if(window.cordova && $cordovaNetwork.isOffline()){
        popupError.noInternet(lang.ERROR_TITLE);
        return;
    }

    getBizTrust.loadUserData(lang.MENU_08).then(function(result) {

      console.log(JSON.stringify(result));

      if(result.data.success == false) {
        console.log("Error - "+result.data);
        return;
      }

      if(result.data.response.successCode != "00") {
        $state.go('app.biztrust_error');
        return;
      }
        // if(result.status != 200){
        //     console.log("Error - "+result.status);
        //     $scope.data.input = "";
        //     return;
        // }

        // if(result.data.data.length == 0){
        //     console.log("Data empty");
        //     $scope.data.input = "";
        //     return;
        // }

        $state.go('app.biztrust_result');

    });

    // $scope.queryData = eQuerySvc.getData();
  }

})

.controller('BizTrustResult', function($scope, $window, getBizTrust) {

  $scope.invalidCodeFlag = false;
  $scope.noInfoFlag = false;

  var companydata = getBizTrust.getData().response;
  $scope.responseData = companydata;

  console.log(JSON.stringify($scope.responseData));

  if(companydata.successCode !== "00") {
    $scope.invalidCodeFlag = true;
    $scope.noInfoFlag = false;
  }

  $window.OpenLink = function(link) {
    cordova.InAppBrowser.open( link, '_system');
  };

});
