/**
Note : Repeatable functions - Just continue from previuos
**/
angular.module('myServices', [])

.constant('config', {
    apiUrl: 'https://m.ssm.com.my/api/',
    apiv2url: 'https://m.ssm.com.my/apiv2/index.php/',
})

.factory('popupError',function($ionicPopup, $ionicHistory){
    var noInternet = function(title){
        var alertPopup = $ionicPopup.alert({
          title: title,
          template: "<center>{{'ERROR_INTERNET'|translate}}</center>",
          buttons: [
            { text: '<b class="title-class">OK</b>',
              type: 'button-positive',
              onTap: function(e) {
//                $ionicHistory.goBack();
              }
            }
          ]
        });
    };
    
    var serverFail = function(title, isBack, errNo){
        msg = "<center>{{'ERROR_QUERY'|translate}}</center>"
        if(errNo === 401){
            msg = "<center>{{'ERROR_AUTHORIZED'|translate}}</center>"    
        }else if(errNo===429){
            msg = "<center>{{'ERROR_OVERLIMIT'|translate}}</center>"
        }
        var alertPopup = $ionicPopup.alert({
          title: title ,
          template: msg,
          buttons: [
            { text: '<b class="title-class">Close</b>',
              type: 'button-positive',
              onTap: function(e) {
                alertPopup.close();
                if(isBack){
                    $ionicHistory.goBack();
                }
                   
              }
            }
          ]
        });
    };
    
    var noRecord = function(title){
        var alertPopup = $ionicPopup.alert({
            title: title,
            template: '<center><div translate="norecord"></div></center>',
            buttons: [
              { text: '<b class="title-class">OK</b>',
                type: 'button-positive',
                onTap: function(e) {
//                  $ionicHistory.goBack();
                }
              }
            ]
          });
    }

    var serverBusy = function(title){
      var alertPopup = $ionicPopup.alert({
          title: title,
          template: '<center><div translate="serverbusy"></div></center>',
          buttons: [
            { text: '<b class="title-class">OK</b>',
              type: 'button-positive',
              onTap: function(e) {
                 $ionicHistory.goBack();
              }
            }
          ]
        });
    }
    
    return {
        noInternet  : noInternet,
        serverFail  : serverFail,
        noRecord    : noRecord,
        serverBusy  : serverBusy
    };
})

.factory('licInfo', function($ionicPopup, $interval) {
  var stop;
  function startInfo() {
    stop = $interval(showLicInfo, 20000);
  };

  function showLicInfo() {
    $interval.cancel(stop);
    var alertPopup = $ionicPopup.alert({
      title: '<h4 class="title-assertive">Demo Version App</h4>',
      template: "This version is for internal demo only",
      buttons: [
        { text: '<b class="title-class">Close</b>',
          type: 'button-positive button-small',
          onTap: function(e) {
            alertPopup.close();
            startInfo();
          }
        }
      ]
    });
  };

  return {
    start : startInfo
  }
})

.factory('myFmFactory', function() {
  
  var service = {};
  service.getButtons = function(lang) {
    var buttons = [{
    label: lang.MENU_08,
    icon: 'icon-icon2_308',
    dest: 'app.status308'
  },{
    label: lang.MENU_06,
    icon: 'icon-icon2_eC',
    dest: 'app.ecompound'
  },{
    label: lang.MENU_05,
    icon: 'icon-icon2_eQ',
    dest: 'app.equery'
  },{
    label: lang.MENU_07,
    icon: 'icon-icon2_eS',
    dest: 'app.esearch'
  }];
    
    return buttons;
  }
  return service;
})

.factory('myContactUs', function() {
  var contactlist = [{
    // label: 'Like Us on Facebook',
    icon: 'ion-social-facebook',
    dest: 'https://www.facebook.com/ssmofficialpage',
    mood: 'positive'
  },
  {
    // label: 'Follow Us on Twitter',
    icon: 'ion-social-twitter',
    dest: 'https://twitter.com/ssmofficialpage',
    mood: 'calm'
  },
    {
    // label: 'Follow Us on Instagram',
    icon: 'ion-social-instagram',
    dest: 'https://instagram.com/ssmofficialpage',
    mood: 'dark'
  },
  {
    // label: 'Subscribe our Channel on Youtube',
    icon: 'ion-social-youtube',
    dest: 'https://www.youtube.com/user/ssmofficialpage',
    mood: 'assertive'
  }
  ];

  var service = {};
  service.getcontactlist = function() {
    return contactlist;
  }
  return service;
})

// only one for all queries because can only ask one per time
.factory('eQuerySvc', function($ionicPopup, langSvc) {
  var queryData = {
    first: "",
    second: "",
    query: ""
  };

  var setData = function(data) {
    queryData = data;
  };

  var getData = function() {
    return queryData;
  };
  var emptySearch = function() {
    
    var lang = translations[langSvc.getLang()];
    var alertPopup = $ionicPopup.alert({
      title: lang.ATTENTION,
      template: '<center><div translate="emptySearch"></div></center>',
      buttons: [
        { text: '<b class="title-class">Ok</b>',
          type: 'button-positive',
        }
      ]
    });
  }

  return {
    getData : getData,
    setData : setData,
    emptySearch :  emptySearch
  };
})

.factory('deviceAuth', function($http, $ionicLoading, config, md5) {
  var uuid = "";
  var platform = "";
  var token = "";
  var tokenV1 = "";

  function setUUID(val) { uuid = val; }

  function setPlatform(val) { platform = val; }

  function setToken(val) { token = val; }

  function setTokenV1(val) { tokenV1 = val; }

  function getDevInfo() {
    return {
      "uuid" : uuid,
      "platform" : platform,
      "token" : token,
      "tokenV1" : tokenV1
    }
  }

  var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };

  var loadingHide = function(){
    $ionicLoading.hide();
  };

  function registerDeviceV1() { 
    loadingShow(); 
    var postUsers = $http({ 
      method: 'POST', 
      url: config.apiUrl + 'register-device', 
      data: { "uuid" : uuid, "type" : platform } 
    }).success(function(result) { 
        return result.data; 
    }).error(function(data, status) { 
      // Do something on error 
        console.log("Device registration failed."); 
    }).finally(function() { 
      // On both cases hide the loading 
      loadingHide(); 
    }); 
    return postUsers; 
  }; 

  function registerDevice() {
    loadingShow();
    var secKey = 'ZMVbSD0CZwdRDxTd3DzvfDT8xy60ZgwX';
    var timeNow = Math.floor(new Date().getTime()/100000);
    var calculatedHash = md5.createHash(uuid+platform+timeNow+secKey);

    var postUsers = $http({
      method: 'POST',
      url: config.apiv2url + 'device/register',
      data: { "uuid" : uuid, "os" : platform, "hash" : calculatedHash }
    }).success(function(result) {
        return result;
    }).error(function(data, status) {
      // Do something on error
        console.log("Device registration failed.");
    }).finally(function() {
      // On both cases hide the loading
      loadingHide();
    });
    return postUsers;
  };

  return {
    setUUID : setUUID,
    setPlatform : setPlatform,
    registerDevice : registerDevice,
    getDevInfo : getDevInfo,
    setToken : setToken,
    registerDeviceV1 : registerDeviceV1,
    setTokenV1 : setTokenV1
  }
})

.factory('newsSvc', function($http, $ionicLoading, eQuerySvc, config, popupError, deviceAuth) {
    
  var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };

  var loadingHide = function(){
    $ionicLoading.hide();
  };

  function getNews(title) {

    loadingShow();

    var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
    var header = { "Authorization" : authHeader };

    var urlFinal = config.apiv2url + 'rss';
    var postUsers = $http({
      method: 'GET',
      url: urlFinal,
      headers: header
    }).success(function(result) {
      return result;
    }).error(function(data, status) {
      popupError.serverFail(title);
    }).finally(function() {
      loadingHide();
    });
    return postUsers;
  };

  function getDetailNews(title) {
    var queryData = eQuerySvc.getData();
    var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
    var header = { "Authorization" : authHeader };
    loadingShow();
    var postUsers = $http({
      method: 'GET',
      url: queryData.query,
      headers: header
    }).success(function(result) {
        return result;
    }).error(function(data, status) {
       popupError.serverFail(title,true);
    }).finally(function() {
      loadingHide();
    });
    return postUsers;
  }

  return {
    getNews : getNews,
    getDetailNews : getDetailNews
  }
})

.factory('getQuery', function($http, $ionicLoading, deviceAuth, eQuerySvc, langSvc, config, popupError) {

  var resultData;
    
  var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };

  var loadingHide = function(){
    $ionicLoading.hide();
  };

  var service = {};
  function loadUserData(title) {
    var devInfo = deviceAuth.getDevInfo();
    var queryData = eQuerySvc.getData();
    var outLang = langSvc.getLang();

    console.log("eQuery v1 token: ===> " + devInfo.tokenV1);

    loadingShow();
    var postUsers = $http({
      method: 'POST',
      url: config.apiUrl + 'equery',
      data: { "token" : devInfo.tokenV1, "documentNo" : queryData.query, lang : outLang }
    }).success(function(result) {
        if (result.data.length === 0) {
          popupError.noRecord(title);
        }
        resultData = result.data;
        return result.data;
    }).error(function(data, status) {
        popupError.serverFail(title,false,status);
    }).finally(function() {
      // On both cases hide the loading
      loadingHide();
    });
    return postUsers;
  };
    
  function getData(){
    return resultData;
  };

  return {
    loadUserData : loadUserData,
    getData: getData
  }
  
})

.factory('getCmpnd', function($http, $ionicLoading, deviceAuth, eQuerySvc, config, popupError) {
    
  var resultData;

  var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };

  var loadingHide = function(){
    $ionicLoading.hide();
  };

  function loadUserData(title) {

    var devInfo = deviceAuth.getDevInfo();
    var queryData = eQuerySvc.getData();

    loadingShow();

    var postUsers = $http({
      method: 'POST',
      url: config.apiUrl + 'ecompound',
      data: { "token" : devInfo.tokenV1, "type": queryData.first,
              "entityType": queryData.second, "entityNo": queryData.query }
    }).success(function(result) {
      if (result.data.length === 0) {
        popupError.noRecord(title);
      }
        resultData = result.data;
        return result.data;
    }).error(function(data, status) {
        popupError.serverFail(title,false,status);
    }).finally(function() {
      loadingHide();
    });
    return postUsers;
  };


  function getData(){
    return resultData;
  };
    
  return {
    loadUserData : loadUserData,
    getData: getData
  }
})

.factory('getSearch', function($http, $ionicLoading, deviceAuth, eQuerySvc, config, popupError) {

  var resultData;
    
  var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };

  var loadingHide = function(){
    $ionicLoading.hide();
  };

  function loadUserData(title) {

    var devInfo = deviceAuth.getDevInfo();
    var queryData = eQuerySvc.getData();

    loadingShow();

    // cater for new comp/business registration number
    var queryUrl = 'esearch/';
    var findUrl;
    var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
    var header = { "Authorization" : authHeader };
    if(queryData.first === "ROC" | queryData.first === "ROCNEW") {
      findUrl = 'findRoc/';
    } else if (queryData.first === "ROB" | queryData.first === "ROBNEW"){
      findUrl = 'findRob/';
    } else {
      findUrl = 'findLlp/';
    }

    var postUsers = $http({
      method: 'GET',
      url: config.apiv2url + queryUrl + findUrl + queryData.query,
      headers: header
    }).success(function(result) {
        if (queryData.first === "LLP") {
          if (result.length === 0) {
            popupError.noRecord(title);
          }
        } else {
          if (result.length === 0) {
            popupError.noRecord(title);
          } else if (!result.success) {
            popupError.serverBusy(title);
          }
        }
        
        resultData = result;
        return result;
    }).error(function(data, status) {
      popupError.serverFail(title,false,status);
    }).finally(function() {
      loadingHide();
    });
    return postUsers;
  };
  
  function getData(){
    return resultData;
  };

  return {
    loadUserData : loadUserData,
    getData: getData
  }
})

.factory('getS308', function($http, $ionicLoading, deviceAuth, eQuerySvc, config, popupError) {

  var resultData;

  var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };

  var loadingHide = function(){
    $ionicLoading.hide();
  };

  function loadUserData(title) {

    var devInfo = deviceAuth.getDevInfo();
    var queryData = eQuerySvc.getData();

    loadingShow();
    var postUsers = $http({
      method: 'POST',
      url: config.apiUrl + 'strikeoff',
      data: { "token" : devInfo.tokenV1, "companyNo": queryData.query }
    }).success(function(result) {
        if (result.data.length === 0) {
          popupError.noRecord(title);
        }
        
        resultData = result.data;
        return result.data;
    }).error(function(data, status) {
      popupError.serverFail(title,false,status);
    }).finally(function() {
      loadingHide();
    });
    return postUsers;
  };

  function getData(){
    return resultData;
  };

  return {
    loadUserData : loadUserData,
    getData: getData
  }
})

.factory('langSvc', function() {

  var outLang = "en";

  function selectLang(selLang) {
    outLang = selLang;
  }

  function getLang() {
    return outLang;
  }

  return {
    setLang: selectLang,
    getLang: getLang
  }
})

.factory('currTranslateSvc',function(){
    
    var data;
    
    function setData(data){
        this.data = data;
    }
    
    function getData(){
        return this.data;
    }
    
    return {
        setData: setData,
        getData: getData
    }
})

.factory('newsStoreSvc',function(){
    
    var data;
    
    function setData(data){
        this.data = data;
    }
    
    function getData(){
        return this.data;
    }
    
    return {
        setData: setData,
        getData: getData
    }
})


//Service List Of Offices
.factory('SSMOfficesService', function($http, $ionicLoading, config, popupError, deviceAuth) {
    
   var loadingShow = function() {
    $ionicLoading.show({
      template: '<p translate="SEARCHING">Searching ...</p><ion-spinner></ion-spinner>'
    });
  };
    
  var loadingHide = function(){
    $ionicLoading.hide();
  };
    

  function getOffices() {
      
      loadingShow();
      var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
      var header = { "Authorization" : authHeader };
      var urlFinal = config.apiv2url + 'contact_us';

      var offices = $http({
        method: 'GET',
        url: urlFinal,
        headers: header
      }).success(function(result) {
          return result.data;
      }).error(function(data, status) {
        popupError.serverFail(title,false);
      }).finally(function() {
        loadingHide();
      });
      
      return offices;
  };
    
  return {
    list: getOffices
  }
    
});

