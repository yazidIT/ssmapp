/**
Note : Repeatable functions - Just continue from previuos
**/
angular.module('myServices', [])

/**
 * Main URL for backend API
 */
.constant('config', {
    apiUrl: 'https://m.ssm.com.my/api/',
    apiv2url: 'https://m.ssm.com.my/apiv2/index.php/',
})

/**
 * Various popup type
 */
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

    var generalAlert = function(title, message){
      var alertPopup = $ionicPopup.alert({
          title: title,
          template: "<center>" + message + "</center>",
          buttons: [
            { text: '<b class="title-class">OK</b>',
              type: 'button-positive',
              onTap: function(e) {}
            }
          ]
        });
    };

    return {
        noInternet  : noInternet,
        serverFail  : serverFail,
        noRecord    : noRecord,
        serverBusy  : serverBusy,
        generalAlert : generalAlert
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

/**
 * Material Flobating Button
 */
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
  },{
    label: lang.MENU_09,
    icon: 'icon-html-five',
    dest: 'app.biztrust'
  }];

    return buttons;
  }
  return service;
})

/**
 * Social Media link
 */
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

/**
 * Storage for query data. Shared.
 */
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

/**
 * Device registration and info storage
 */
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
    setTokenV1 : setTokenV1
  }
})

/**
 * RSS news
 */
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

/**
 * E-query service
 */
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
    var queryData = eQuerySvc.getData();
    var outLang = langSvc.getLang();

    var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
    var header = { "Authorization" : authHeader };

    loadingShow();
    var postUsers = $http({
      method: 'POST',
      url: config.apiv2url + 'esearch/equery',
      headers: header,
      data: { "documentNo" : queryData.query, "lang" : outLang }
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

/**
 * E-compound query
 */
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

        var queryUrl = 'esearch/ecompound/';
        var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
        var header = { "Authorization" : authHeader };

        loadingShow();

        var queryData = { "token" : devInfo.tokenV1, "type": queryData.first,
        "entityType": queryData.second, "entityNo": queryData.query };

        var postUsers = $http({
            method: 'POST',
            url: config.apiv2url + queryUrl,
            data: queryData
        }).success(function(result) {
            if (result.message === "data not found") {
                popupError.noRecord(title);
            } else if (result.data.length === 0) {
                popupError.noRecord(title);
            }
            console.log(JSON.stringify(result))

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

/**
 * E-search service
 */
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

        if(queryData.first === "LLP") {
          if (result.length === 0) {
            popupError.noRecord(title);
          }
        } else if(result.result === undefined) {
          popupError.noRecord(title)
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

/**
 * S-308 service
 */
.factory('getS308', function($http, $ionicLoading, deviceAuth, eQuerySvc, config, popupError) {

  var resultData;
  var resultCos;

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
    var queryUrl = 'esearch/status308/';
    var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
    var header = { "Authorization" : authHeader };

    loadingShow();
    var postUsers = $http({
      method: 'GET',
      url: config.apiv2url + queryUrl + queryData.query
    }).success(function(result) {

        if (result.data.length === 0) {
          popupError.noRecord(title);
        }

        resultData = result.data;
        resultCos = result.cos;
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

  function getCos() {
    return resultCos;
  }

  return {
    loadUserData : loadUserData,
    getData: getData,
    getCos: getCos
  }
})

/**
 * Language selection and translation service
 */
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

/**
 * News storage service
 */
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

/**
 * Office location service
 */
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
      var title = "Contact Us"
      var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
      var header = { "Authorization" : authHeader };
      var urlFinal = config.apiv2url + 'contact_us';

      console.log(JSON.stringify(header))
      var offices = $http({
        method: 'GET',
        url: urlFinal,
        headers: header
      }).success(function(result) {

          console.log(JSON.stringify(result))
          return result.data;
      }).error(function(data, status) {

        console.log(JSON.stringify(data))
        console.log(status)
        popupError.serverFail(title,false);
      }).finally(function() {
        loadingHide();
      });

      return offices;
  };

  return {
    list: getOffices
  }

})

.factory('docCode', function($http, langSvc) {

  var docNameLibrary;
  var docLanguage;

  function loadDocumentDictionary() {

    if(langSvc.getLang() == 'en')
      docLanguage = "json/doccode_en.json";
    else
      docLanguage = "json/doccode_ms.json";

    return $http.get(docLanguage).success(data => {
      docNameLibrary = data.data;
      return docNameLibrary;
    })

  }

  return {
    loadDocumentDictionary: loadDocumentDictionary
  }
})

.factory('dateUtil', function() {

  function getDateMsFormat(dateObj) {
    const months = ["01", "02", "03","04", "05", "06", "07", "08", "09", "10", "11", "12"];
    var formatted_date = dateObj.getDate() + "/" + months[dateObj.getMonth()] + "/" + dateObj.getFullYear();
    return formatted_date;
  }

  // process date of the form "2015-12-25 00:00:00"
  // non stndard form - causing issue with JavaScript in iOs
  function getDateNonStandard(nonStdDateStr) {
    var d = new Date(nonStdDateStr.substring(0,10).replace(/-/g, '/'));
    var dateResult = getDateMsFormat(d)
    return dateResult;
  }

  return {
    getDateMsFormat: getDateMsFormat,
    getDateNonStandard: getDateNonStandard
  }
})

.factory('contactData', function($http) {

  var contactDataDoc;
  var contactDataLibrary;

  function loadContactData() {

    contactDataDoc = "json/contact.json";
    return $http.get(contactDataDoc).success(data => {

      contactDataLibrary = data;
      return contactDataLibrary;
    })

  }

  return {
    loadContactData: loadContactData
  }
})

/**
 * BizTrust service
 */
.factory('getBizTrust', function($http, $ionicLoading, deviceAuth, eQuerySvc, config, popupError) {

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

    var qrcodeData = eQuerySvc.getData();

    loadingShow();

    var queryUrl = 'qr/resolve';
    var authHeader = 'Bearer' + ' ' + deviceAuth.getDevInfo().token;
    var header = { "Authorization" : authHeader };
    var urlFinal = config.apiv2url + queryUrl;
    var qrcodeobject = "?qrcode=" + qrcodeData.first;

    var postUsers = $http({
      method: 'POST',
      url: urlFinal + qrcodeobject,
      headers: header
    }).success(function(result) {

        resultData = result;
        return result;

    }).error(function(data, status) {
      console.log(JSON.stringify(data));
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
});

