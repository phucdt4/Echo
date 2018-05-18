var CV_URL_GOOGLE = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDUtfHGm2PUmYz9SWLzIywIDutskelCFqE';

//crop an image
function cropImage(img,cropX,cropY,cropWidth,cropHeight){
// create a temporary canvas sized to the cropped size
var canvas1=document.createElement('canvas');
var ctx1=canvas1.getContext('2d');
canvas1.width=cropWidth;
canvas1.height=cropHeight;
// use the extended from of drawImage to draw the
// cropped area to the temp canvas
ctx1.drawImage(img,cropX,cropY,cropWidth,cropHeight,0,0,cropWidth,cropHeight);
// return the .toDataURL of the temp canvas
return(canvas1.toDataURL());
}

// Get platform
function getPlatform(){
    if (window.cordova){
        //IOS , Android, Browser
        return device.platform;
    }
    else {
        return "undefined";
    }
}

// Is Online
function isOnline(){
    if (navigator.network.connection.type == Connection.NONE) {
    	return 'N';
    }
    else {
    	return 'Y';
    };
}

// Check is browser or not
function isBrowser(doc) {
var app = doc.URL.indexOf( 'http://' ) === -1 && doc.URL.indexOf( 'https://' ) === -1;
    if ( app ) {
    	// PhoneGap application
    	return 'Mobile';
    } else {
    	// Web page
    	return 'Browser';
    }
}

function getImageTest()
{
  getimage(bucket,name,function(){
    
  });
}
//Get Image from S3
function getimage(bucket,name,callback)
{
    var apigClient = apigClientFactory.newClient({
      apiKey: 'om5BWpVRi18njXQ1coGrr8lWJkBpxEjG9gF33ROm'
      //accessKey: 'AKIAIZVH4J5AG5NU3ECQ',
      //secretKey: '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',
    });
    var params = {
      // This is where any modeled request parameters should be added.
      // The key is the parameter name, as it is defined in the API in API Gateway.
    };

    var body = {
      // This is where you define the body of the request,
      "bucket": bucket,
      "name": name,
    };

    var additionalParams = {
      // If there are any unmodeled query parameters or headers that must be
      //   sent with the request, add them here.
      headers: {
      },
      queryParams: {
      }
    };

    apigClient.getimagePost(params, body, additionalParams)
    	.then(function(result){
    	  // Add success callback code here.
    	  console.log(result.data);
    	  var data = result.data.data;
    	  callback(data);
    	}).catch( function(result){
    	  console.log(result);
    	  callback("");
    	  // Add error callback code here.
    });
}

// Save image to s3
function uploadimage(bucket,name,data)
{
    var apigClient = apigClientFactory.newClient({
      apiKey: 'om5BWpVRi18njXQ1coGrr8lWJkBpxEjG9gF33ROm'
      //accessKey: 'AKIAIZVH4J5AG5NU3ECQ',
      //secretKey: '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',
    });
    var params = {
      // This is where any modeled request parameters should be added.
      // The key is the parameter name, as it is defined in the API in API Gateway.
    };

    var body = {
      // This is where you define the body of the request,
      "bucket": bucket,
      "name": name,
      "data": data
    };

    var additionalParams = {
      // If there are any unmodeled query parameters or headers that must be
      //   sent with the request, add them here.
      headers: {
      },
      queryParams: {
      }
    };

    apigClient.importimagePost(params, body, additionalParams)
    	.then(function(result){
    	  // Add success callback code here.
    	  console.log(result);
    	}).catch( function(result){
    	  console.log(result);
    	  // Add error callback code here.
    });
}


/**
* 'submit' event handler - reads the image bytes and sends it to the Cloud
* Vision API.
*/
function uploadFiles (event) {
    //window.open('tel:12345678', '_system');
    event.preventDefault(); // Prevent the default form post

    // Grab the file and asynchronously convert to base64.
    var file = $('#fileinput [name=fileField]')[0].files[0];
    var reader = new FileReader();
    reader.onloadend = processFile;
    reader.readAsDataURL(file);
}

//Get file size
function getFileSize(datauri){
    var head = 'data:image/png;base64,';
    return Math.round((datauri.length - head.length)*3/4);
}

/**
* Event handler for a file's data url - extract the image data and pass it off.
*/
function processFile (event) {
    var content = event.target.result;
    console.log(getFileSize(content));
    //neu file size > 4MB thi thu nho lai
    if (getFileSize(content) > 4000000)
    {
      //resize
      resizeImage(content,0.3, function(data){
          content = data.replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', '').replace('data:image/jpeg;base64,', '')
          processImage(content,function(finalImage){
              content = finalImage.replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', '').replace('data:image/jpeg;base64,', '')
              sendFileToCloudVision(content);
              //Save Image to S3
              uploadimage("phucdo","dothienphuc",finalImage);
          });
      });
    }
    else
    {

      content = content.replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', '').replace('data:image/jpeg;base64,', '');
      processImage(content,function(finalImage){
          content = finalImage.replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', '').replace('data:image/jpeg;base64,', '')
          //Upload to Google Cloud
          sendFileToCloudVision(content);
          //Save Image to S3
          uploadimage("phucdo","dothienphuc",finalImage);

      });
    }
}

// A button will call this function
function capturePhotoWithData() {
    // Take picture using device camera and retrieve image as base64-encoded string
    //$('#results').text('Loading...');
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 100,
                                                            encodingType: Camera.EncodingType.PNG,
                                                            mediaType: Camera.MediaType.PICTURE,
                                                            destinationType: Camera.DestinationType.DATA_URL,
                                                            correctOrientation: true });
}

// Browse an image from library
function getPhotoWithLibrary() {
    // Retrieve image file location from specified source
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 100,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY});
}

//Scale Image size
function processImage(imageData,callback)
{
    //scale image size
    var smallImage = document.getElementById('main');
    //var smallImage = document.createElement('canvas');
    var ctx= smallImage.getContext("2d");
    var image = new Image();
    image.onload = function() {
      if (image.width > image.height)
      {
          smallImage.width = 1024;
          smallImage.height = 768;
      }
      else
      {
          smallImage.width = 768;;
          smallImage.height = 1024;
      }

      ctx.drawImage(image, 0, 0,image.width,image.height,0,0,smallImage.width,smallImage.height);

      //gray scale image
      var imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      var data = imageData.data;

      for(var i = 0; i < data.length; i += 4) {
        var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        // red
        data[i] = brightness;
        // green
        data[i + 1] = brightness;
        // blue
        data[i + 2] = brightness;
      }
      ctx.putImageData(imageData, 0, 0);

      var dataURL = smallImage.toDataURL("image/png");
      callback(dataURL);
    };
    image.src = "data:image/png;base64," + imageData;
}

// Called when a photo is successfully retrieved
function onPhotoDataSuccess(imageData) {
    console.log(imageData);
    // Get image handle
    //$('#results').text("Thanh cong");
    //window.plugins.uniqueDeviceID.get(success, fail);
    /*
    processImage(imageData, function(dataURL){
      uploadimage("phucdo","testhinh",dataURL);
      content = dataURL.replace('data:image/png;base64,', '').replace('data:image/jpg;base64,', '').replace('data:image/jpeg;base64,', '');
      //Upload to Google Cloud
      sendFileToCloudVision(content);
    });
    */
}

// Called if something bad happens.
function onFail(message) {
    console.log('Failed because: ' + message);
}


//setting image name
function setImageName(name)
{
    //concate file name with current date-time
    var start = Date.now();
    name = name + "_" + start + ".png";
    return name;
}

/**
* Sends the given file contents to the Cloud Vision API and outputs the
* results.
*/
function sendFileToCloudVision (content,user,image) {
    var type = $('#fileform [name=type]').val();

    // Strip out the file prefix when you convert to json.
    var request = {
     requests: [{
       image: {
         content: content
       },
       features: [{
         type: "DOCUMENT_TEXT_DETECTION",
         maxResults: 1000
         },
         {
           type: "LABEL_DETECTION",
           maxResults: 200
       }],
    	  imageContext: {
    		languageHints: ["vi"],
    	  }
     }]
    };
//$('#results').text('Loading...');
	var http = new XMLHttpRequest();
	var url = CV_URL_GOOGLE;
	var params = JSON.stringify(request);
	http.open("POST", url, true);

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "text/xml");

	http.onreadystatechange = function() {//Call a function when the state changes
		//if(((http.readyState == 4)) && http.status == 200) {
     if(http.readyState == 4 && http.status == 200) {
         //console.log(http.responseText);
         var json = JSON.parse(http.responseText);
         console.log(json.responses[0]);
         var response = json.responses[0];
         var textAnnotations = response.textAnnotations;
         var allItems = [];
         //$('#results').text(textAnnotations[0].description);
         // Xu ly du lieu thanh tung dong co nghia
         //console.log(textAnnotations);
         for (var x=0; x < textAnnotations.length; x++) {
             if (x > 0)
             {
                 var item = [];
                 item.push(textAnnotations[x].description);
                 //console.log(textAnnotations[x].description);
                 var boundingPoly = textAnnotations[x].boundingPoly;
                 var vertices = boundingPoly.vertices;
                 for (var i=0; i < vertices.length; i++) {
                     item.push(vertices[i].x);
                     item.push(vertices[i].y);

                 }
                 //console.log(allItems.length);
                 allItems.push(item);
             }
         }
         //console.log("Ban dau");
         console.log(allItems);

         //sort theo line -cai nao co Y3 nho nhat thi xep truoc
         var swapped;
         do {
             swapped = false;
             for (var j=0; j < allItems.length - 1; j++) {
                 if (allItems[j][8] > allItems[j+1][8]) {
                     var temp = allItems[j];
                     allItems[j] = allItems[j+1];
                     allItems[j+1] = temp;
                     swapped = true;
                 }
             }
         } while (swapped);
         var tmp = -1;
         var tmpScan = -1;
         var start = 0;
         console.log("Sort Line");
         //console.log(allItems.length);
         for (var x=0; x < allItems.length; x++) {
             //console.log(allItems[x]);
         }
         //Sort on each line
         for (var i = 0; i < allItems.length; i++)
         {
             if (tmp == -1){
                 tmp  = allItems[i][8];
                 start = 0; //(allItems[i][8]-allItems[i][2])
             }
             else{
                 if ((allItems[i][2] - tmp  >= 0) || (Math.abs(allItems[i][2] - tmp) <  (allItems[i][8] - allItems[i][2]) / 3 ))
                 {
                     //new line - sort tung chu tren moi dong
                     var swapped;
                     do {
                         swapped = false;
                         for (var j=start; j < i-1; j++) {
                             if (allItems[j][1] > allItems[j+1][1]) {
                                 var temp = allItems[j];
                                 allItems[j] = allItems[j+1];
                                 allItems[j+1] = temp;
                                 swapped = true;
                             }
                         }
                     } while (swapped);
                     for(var j = start; j < i; j++){
                         //console.log(allItems[j]);
                     }
                     tmp  = allItems[i][8];
                     start = i;
                 }
                 else
                 {
                     allItems[i][8] = tmp;
                     // dong cuoi
                     if (i == allItems.length - 1)
                     {
                         //new line - sort tung chu tren moi dong
                         var swapped;
                         do {
                             swapped = false;
                             for (var j=start; j < allItems.length-1; j++) {
                                 if (allItems[j][1] > allItems[j+1][1]) {
                                     var temp = allItems[j];
                                     allItems[j] = allItems[j+1];
                                     allItems[j+1] = temp;
                                     swapped = true;
                                 }
                             }
                         } while (swapped);
                         for(var j = start; j < i; j++){
                             //console.log(allItems[j]);
                         }
                         //console.log("Break");
                     }
                 }
             }
         }
         console.log("Sort chu tren tung line");



         //Build a Complete String
         var dataText = "";
         var prev = 0;
         var prevX3 = 0;
         var lines = [];
         var finaltext = "";
         for (var i = 0; i < allItems.length; i++)
         {
             //console.log(allItems[i]);
             if (i == 0)
             {
                 dataText = allItems[i][0].trim();
             }
             else
             {
                 //same line
                 if (allItems[i][8] == prev)
                 {
                     if ((allItems[i][1] - prevX3) > 2*((allItems[i][3]-allItems[i][1])/allItems[i][0].length)){
                         //push previous line
                         //normalize the string
                         //dataText = titleCase(dataText);
                         //remove space before dot
                         dataText = processString(dataText).toUpperCase();
                         lines.push(dataText);
                         finaltext = finaltext + dataText;
                         dataText = allItems[i][0].trim();
                     }
                     else if ((allItems[i][1] - prevX3) < ((allItems[i][3]-allItems[i][1])/allItems[i][0].length) / 5  ) //0.3 * ((allItems[i][3]-allItems[i][1])/allItems[i][0].length)
                     {
                         // viet lien
                         dataText = dataText + allItems[i][0].trim();
                     }
                     else
                     //else if ((allItems[i][3] - prevX3) <= 2*((allItems[i][3]-allItems[i][1])/allItems[i][0].length))
                     {
                         // co dau cach
                         dataText = dataText + " " + allItems[i][0].trim();
                     }
                 }
                 else // different lines
                 {
                     //push previous line
                     dataText = processString(dataText).toUpperCase();
                     lines.push(dataText);
                     finaltext = finaltext + dataText;
                     dataText = allItems[i][0].trim();
                 }
             }
             prev = allItems[i][8];
             prevX3 = allItems[i][3];
             if (i == allItems.length-1)
             {
                 dataText = processString(dataText).toUpperCase();
                 lines.push(dataText);
                 finaltext = finaltext + dataText;
             }
         }
			//$('#results').text(finaltext);
         //console.log(lines);
		} else
		{
			//error
         if (http.status != 200)
         {
             console.log("Error ",http.status);
            // $('#results').text("");
         }
		}
	}
	http.send(params);
}


//process a string
function processString(dataText)
{
    //push previous line
    dataText = dataText.replace(/\s,/g,",");
    dataText = dataText.replace(/,\s/g,",");
    dataText = dataText.replace(/\s\./g,".");
    dataText = dataText.replace(/\.\s/g,".");
    dataText = dataText.replace(/\s\//g,"/");
    dataText = dataText.replace(/\/\s/g,"/");
    dataText = dataText.replace(/-\s/g,"-");
    dataText = dataText.replace(/\s-/g,"-");
    dataText = dataText.replace(/\s\+/g,"+");
    dataText = dataText.replace(/\+\s/g,"+");
    dataText = dataText.replace(/\s\)/g,")");
    dataText = dataText.replace(/\(\s/g,"(");
    //dataText = dataText.replace("\\s+[.]",".");
    //dataText = dataText.replace(/ +(?= )/g,' ');
    dataText = dataText.replace(/\s%/g,"%");
    dataText = dataText.replace(/%\s/g,"%");
    dataText = dataText.replace(/\s#/g,"#");
    dataText = dataText.replace(/#\s/g,"#");
    dataText = dataText.replace(/\s:/g,":");
    dataText = dataText.replace(/:\s/g,":");
    dataText = dataText.replace(/\:$/, ''); // remove colon at the end.
    dataText = dataText + '\n';
    return dataText;
}

// check number is floar or string
function isNumber(inputtxt)
{
    var numbers = /^[0-9]+$/;
    if(inputtxt.replace(".","").match(numbers))
    {
        return !isNaN(parseFloat(inputtxt)) && true;
    }
    else
    {
        return false;
    }
}


//Uppercase the first character of each word
function titleCase(str) {
 str = str.toLowerCase().split(' ');                // will split the string delimited by space into an array of words

 for(var i = 0; i < str.length; i++){               // str.length holds the number of occurrences of the array...
      str[i] = str[i].split('');                    // splits the array occurrence into an array of letters
      str[i][0] = str[i][0].toUpperCase();          // converts the first occurrence of the array to uppercase
      str[i] = str[i].join('');                     // converts the array of letters back into a word.
 }
 return str.join(' ');                              //  converts the array of words back to a sentence.
}


// Check similarity of two words
function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
        if (longerLength == 0) {
            return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}


// Change Local Language
function changeLanguage(language)
{
    var languageSpecificObject = null;
    var languageSpecificURL = "";
    var vietnameseLanguageSpecificURL = "i18n/vi/strings.json";
    var englishLanguageSpecificURL = "i18n/en/strings.json";

    //Function to make network call according to language on load
    var languageControls = function(language){

        if((language.toString() == "vi") || (language.toString() == "vietnam") || (language.toString().indexOf("vi") != -1)){
    		languageSpecificURL = vietnameseLanguageSpecificURL;
        }
        else{
    		//Default English
    		languageSpecificURL = englishLanguageSpecificURL;
        }
    	//Make an ajax call to strings.json files
        onNetworkCall(language.toString(),languageSpecificURL,function(msg){
        	languageSpecificObject = msg;
            console.log(document);
            angular.forEach(document.querySelectorAll('.languagespecificHTML'), function(value, key) {
                console.log(value);
            });
        	$(".languagespecificHTML").each(function(){
                console.log('inside');
                //console.log(languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        		$(this).html(languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        	});
        	$(".languageSpecificPlaceholder").each(function(){
        		$(this).attr("placeholder",languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        	});
        			$(".languageSpecificValue").each(function(){
        		$(this).attr("value",languageSpecificObject.languageSpecifications[0][$(this).data("text")]);
        	});
        });
    };

    //Function to get specific value with unique key
    var getLanguageValue = function(key){
    value = languageSpecificObject.languageSpecifications[0][key];
    return value;
    };

    //Network Call
    var onNetworkCall = function fetchJSONFile(language, path, callback) {
    	var httpRequest = new XMLHttpRequest();
        if (language.indexOf('vi') > -1)
        {
            if (window.sessionStorage.getItem("translatorVI") == null)
            {
                httpRequest.onreadystatechange = function() {
            		if (httpRequest.readyState === 4) {
            			if (httpRequest.status === 200  || ( httpRequest.responseText != "" && httpRequest.responseText != undefined )) {
            				var data = JSON.parse(httpRequest.responseText);
                            window.sessionStorage.setItem("translatorVI",JSON.stringify(data));
            				if (callback) callback(data);
            			}
            		}
            	};
            	httpRequest.open('GET', path);
            	httpRequest.send();
            }
            else
            {
                if (callback) callback(JSON.parse(window.sessionStorage.getItem("translatorVI")));
            }
        }
        else if (language.indexOf('en') > -1)
        {
            if (window.sessionStorage.getItem("translatorEN") == null)
            {
                httpRequest.onreadystatechange = function() {
            		if (httpRequest.readyState === 4) {
            			if (httpRequest.status === 200  || ( httpRequest.responseText != "" && httpRequest.responseText != undefined )) {
            				var data = JSON.parse(httpRequest.responseText);
                            window.sessionStorage.setItem("translatorEN",JSON.stringify(data));
            				if (callback) callback(data);
            			}
            		}
            	};
            	httpRequest.open('GET', path);
            	httpRequest.send();
            }
            else
            {
                if (callback) callback(JSON.parse(window.sessionStorage.getItem("translatorEN")));
            }
        }
    }
    languageControls(language);
}

function copyDatabaseFile(dbName) {

  var sourceFileName = cordova.file.applicationDirectory + 'www/' + dbName;
  var targetDirName = cordova.file.dataDirectory;

  return Promise.all([
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(sourceFileName, resolve, reject);
    }),
    new Promise(function (resolve, reject) {
      resolveLocalFileSystemURL(targetDirName, resolve, reject);
    })
  ]).then(function (files) {
    var sourceFile = files[0];
    var targetDir = files[1];
    return new Promise(function (resolve, reject) {
      targetDir.getFile(dbName, {}, resolve, reject);
    }).then(function () {
      console.log("file already copied");
    }).catch(function () {
      console.log("file doesn't exist, copying it");
      return new Promise(function (resolve, reject) {
        sourceFile.copyTo(targetDir, dbName, resolve, reject);
      }).then(function () {
        console.log("database file copied");
      });
    });
  });
}
