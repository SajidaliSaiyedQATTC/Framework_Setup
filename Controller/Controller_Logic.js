let genericHandle = require("../Controller/Controller_Logic.js");

var child_process = require("child_process");
var spawn = child_process.spawnSync;
var PDFParser = require("../node_modules/pdf2json");
const XLSX = require("../node_modules/xlsx");
let txtDiff=require("text-diff");
require("../Demo_Project/config.js")
var diff = new txtDiff();
global.driver;
global.currentDate = new Date();
let  fs =require("fs");
const { yourPorjectStructure } = require("../Demo_Project/config.js");
let options,chrome,SeleniumServer;
let Key,By,until;
let webDriverHandle;
global.date =
  currentDate
  .toLocaleDateString()
  .replace(/-/g, "_")
  .replace(/:/g, "_") +
  " " +
  currentDate
  .toLocaleTimeString()
  .replace(/-/g, "_")
  .replace(/:/g, "_");
var directory = __dirname;
let rootFolder = directory;//  C:\Automation Project\\controller
let logFilePAth = rootFolder.replace("Controller","")+"/"+yourPorjectStructure.LogFilePAth;
let scrrenshotPath=rootFolder.replace("Controller","")+"/"+yourPorjectStructure.Screenshots;
let UserPofile=process.env["USERPROFILE"]

// var method = "GRID";
// var method = "NORMAL";

/**This function is used to initialize the driver and then launch a browser instance with the url provided. 
 * It also creates a log file, which will be updated based on each logger event of test cases </br>
 * <b>Input Parameter</b>: <i>Workflow ID</i>,<i>Workflow Description</i>,<i>Module Name</i>,<i>Type Name</i>,<i>URL</i> </br>
 * <b>Output</b>: A driver instance and a dummy log file in the execution repository
 */
////C:\Automation Project\Demo_Project
exports.LaunchServer=async function(
  workflowID,
  workflowDescription,
  moduleName,
  typeName,
  url
) {
  try {
    var defaultDownloadLocation = rootFolder.replace("Controller","")+yourPorjectStructure.DownloadFile;

    (webDriverHandle = require("../node_modules/selenium-webdriver")),
    (SeleniumServer = require("../node_modules/selenium-webdriver/remote").SeleniumServer),
    (chrome = require("../node_modules/selenium-webdriver/chrome")),
    (By = webDriverHandle.By),
    (Key = webDriverHandle.Key),
    (until = webDriverHandle.until);
    var path = require('../node_modules/chromedriver').path;
    options = new chrome.Options();
    

    options.setUserPreferences({
      "download.default_directory": defaultDownloadLocation,
      "profile.default_content_setting_values.notifications": "2",
      "profile.default_content_settings.popups": "0",
      "safebrowsing.enabled": "true",
      "download.prompt_for_download":false,
      'plugins.plugins_disabled': ['Shockwave Flash'],
      "webdriver.chrome.driver" : directory = process.cwd().toString().replace("Controller","")+"node_modules\chromedriver\lib\chromedriver\chromedriver.exe"
     
    });
    //--user-data-dir=C:/Users/[username]/AppData/Local/Google/Chrome/User Data

    options.addArguments("--start-maximized");
    
    options.addArguments("--test-type");
    options.addArguments("disable-infobars");
    options.addArguments('==profile-directory=Default')
    options.addArguments('--disable-popup-blocking');
    options.excludeSwitches("enable-logging")
    options.addArguments("==user-data-dir="+UserPofile+"AppData\Local\Google\Chrome\User Data\Default");
    
   

    if(config.method == 'GRID'){
      driver = new webDriverHandle.Builder()
              .usingServer(config.node)
              .withCapabilities(options)
              .build();    
             
    } else {
      
         driver = new webDriverHandle.Builder()
        .withCapabilities(options)
        .build();
         driver.manage().window().maximize();

  
    }
    
    await driver.get(url);   
    
    await genericHandle.InitializeLog(
      workflowID,
      workflowDescription,
      moduleName,
      typeName,
      url
    );
   
  } catch (errorMessage) {
    await console.log("LaunchServer(): " + errorMessage);
  }
};


/**This function is used to close all the browser instances that are openned during the session.
 * Also it finalizes the closure activities of the logger event </br>
 * <b>Input Parameter</b>: <i><Empty></i> </br>
 * <b>Output</b>: A complete log file will be generated in the execution repository. 
 * Gracefully terminates all the open windows that corresponds to the driver
 */
exports.CloseServer = async function () {
  try {
    await genericHandle.EndLog();
    var windowHandles = await genericHandle.GetWindowHandles();
    for (var i = 0; i < windowHandles.length; i++) {
      await driver.switchTo().window(windowHandles[i]);
      await driver.close();
    }
  } catch (errorMessage) {
    await console.log("CloseServer(): " + errorMessage);
  }
};


exports.OpenPage=async function(url)
{
  await driver.get(url);

  return url;


}



exports.ExecuteJavaScript = async function(command){
  try{
    var response = await driver.executeScript(command);
    await genericHandle.WaitUntilAlertHandled();
    return response;
  }catch(errorMessage){
    await console.log("ExecuteJavaScript(): " + errorMessage);
  }
};

exports.WaitUntilAlertHandled = async function(){
  try{
    // await genericHandle.Sleep(5000);
    var alertHandled = false;
    while(alertHandled == false){
      await genericHandle.Sleep(1000);
      try{
        await driver.switchTo().alert();
        alertHandled = false;
      }catch(errorMessage){
        alertHandled = true;
      }
    }
  }catch(errorMessage){
    await console.log("WaitUntilAlertHandled(): " + errorMessage);
  }
}


/**This function is used to Get the count of nodes that corresponds to the given identifier </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH") and <i>Identifier</i> of the corresponding type) </br>
 * <b>Output</b>: If identifier is valid => return the count of node(s) that corresponds to it. Else => Throw an error stating the failure details
 */


 exports.findAllElements=async function(identifier)
 {
   try {
    await driver.wait(until.elementLocated(By.xpath(identifier)), 9000);
    return await driver.findElements(By.xpath(identifier));

   } catch (error) {
     console.log(error)
     
   }
 }

exports.GetCountOfElements = async function (identifierType, identifier) {
  try {
    var count;
    if (identifierType == "XPATH") {
      await driver.findElements(By.xpath(identifier)).then(function (elements) {
        count = elements;
      });
    }
    return count;
  } catch (errorMessage) {
    await console.log(
      "GetCountOfElements(): " + identifier + " " + errorMessage
    );
    throw new Error("GetCountOfElements(): " + identifier + " " + errorMessage);
  }
};

exports.GetDriver=async function(driverUrl)
{
  
  try
  {
  await driver.get(driverUrl);
  }
  catch(error)
  {
    console.log(error);

  }
}






/**This function will wait for the page load to complete and then will try click the element based on its identifier </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH") and <i>Identifier</i> of the corresponding type) </br>
 * <b>Output</b>: If identifier is valid => Click the node that corresponds to it. Else => Throw an error stating the failure details
 */

exports.ClickElement = async function (identifier) {
  try {
   
    await driver.wait(until.elementLocated(By.xpath(identifier)), 9000);
   await driver.findElement(By.xpath(identifier)).click();
 
  } 
  catch (errorMessage) {
    await console.log("ClickElement(): " + identifier + " " + errorMessage);
    throw new Error("ClickElement(): " + identifier + " " + errorMessage);
    // await process.exit(1);
  }
};

exports.ClickOnPopup = async function (identifierType, identifier) {
  try {
    await genericHandle.WaitForElementVisible(identifier);
    try{
      if (identifierType == "XPATH") {
        newIdentifier = identifier.replace(/'/g,"\'");
        await driver.executeScript("document.evaluate(\""+ newIdentifier + "\", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.focus();")
        await driver.findElement(By.xpath(identifier)).click();
      }
    }catch(errorMessage){
      await driver.findElement(By.xpath("(//html/body)[1]")).click();
      await genericHandle.WaitForElementClickable(identifier);
    }
    await genericHandle.WaitForActionComplete();
  } 
  catch (errorMessage) {
    await console.log("ClickElement(): " + identifier + " " + errorMessage);
    throw new Error("ClickElement(): " + identifier + " " + errorMessage);
    // await process.exit(1);
  }
};
/**This function will wait for the page load to complete and then will try to input the given data, to the element identified based on its identifier </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH"), <i>Identifier</i> of the corresponding type
 * <i>Data</i> that need to be passed</br>
 * <b>Output</b>: If identifier is valid => Pass the data to the node that corresponds to it. Else => Throw an error stating the failure details
 */
exports.SendData = async function (identifierType, identifier, data) {
  try {    
    await genericHandle.ScrollUntil(identifier);
    if (identifierType == "XPATH") {
      await driver.findElement(By.xpath(identifier)).sendKeys(data);
    }
  } 
  catch (errorMessage) {
    await console.log(
      "SendData(): " + identifier + " ," + data + " " + errorMessage
    );
    throw new Error(
      "SendData(): " + identifier + " ," + data + " " + errorMessage
    );
  }
};

/**This function can be used where a manual wait is required </br>
 * <b>Input Parameter</b>: <i>Time</i> in milliseconds </br>
 * <b>Output</b>: Gracefully waits for the given time period before performing any action
 */
exports.Sleep = async function (milliseconds) {
  try {
    await driver.sleep(milliseconds);
    // if (startTime) {
    //   manualDelayToDeduct = manualDelayToDeduct + milliseconds;
    // }
  } catch (errorMessage) {
    await console.log("Sleep(): " + " " + errorMessage);
    throw new Error("Sleep(): " + " " + errorMessage);
  }
};
/**This function will return the text of the identifier provided </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH") and <i>Identifier</i> of the corresponding type) </br>
 * <b>Output</b>: If identifier is valid => The text that corresponds to it. Else => Throw an error stating the failure details
 */

 exports.GetTextvalue=async function(identifier)
 {
   try {
   let text=  await driver.findElement(By.xpath(identifier)).getAttribute("value");
   return text;

     
   } catch (error) {
     console.log(error);
     
   }
 }
exports.GetText = async function (identifierType, identifier) {
  try {
    
    var text;
   // await genericHandle.WaitForElementVisible(identifier);
   await driver.wait(until.elementLocated(By.xpath(identifier)), 9000);
    if (identifierType == "XPATH") {
     await   driver.findElement(By.xpath(identifier)).then(function (element) {
        text = element.getText();
        
      
      });
    }
    
    return text;
  } catch (errorMessage) {
    await console.log("GetText(): " + identifier + " " + errorMessage);
    throw new Error("GetText(): " + identifier + " " + errorMessage);
  }
};




exports.RefreshPage=async function()
{
  await driver.sleep(2000);
  await driver.navigate().refresh();
  await driver.sleep(5000);
}
/**This function can be used to check the presense of an element in UI </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH") and <i>Identifier</i> of the corresponding type) </br>
 * <b>Output</b>: If object that corresponds to the identifier is present => It return TRUE. Else => Return FALSE
 */

exports.checkElementVisible=async function(element)
{
  try
  {
let  checkVisible =await driver.findElement(By.xpath(element)).isDisplayed();
if(checkVisible==true)
{
return true;
}
  }

  catch(error)
  {
    return false;

  }
}
exports.FindIfPresent = async function (identifierType, identifier) {
  try {
    var status = false;
  
    if (identifierType == "XPATH") {
      await driver.wait(until.elementLocated(By.xpath(identifier)), 5000);
      await driver
        .findElement(By.xpath(identifier))
        .then(async function (webElement) {
          status = true;
        });
    }
    return status;
  } catch (errorMessage) {
    await console.log("FindIfPresent (): " + identifier + " " + errorMessage);
    return status;
  }
};
/**This function recieves an identifier and wait till the element disappear from UI </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH") and <i>Identifier</i> of the corresponding type) </br>
 * <b>Output</b>: If identifier doesn't exist => It returns the control back to the function. Else => It waits and keep trying every second
 */
exports.WaitForDisappear = async function (waitElementIdentifier) {
  try {
    var waitElement = await genericHandle.FindIfPresent(waitElementIdentifier);

    while (waitElement == true) {
      await genericHandle.Sleep(1000);
      waitElement = await genericHandle.FindIfPresent(waitElementIdentifier);
    }
    await genericHandle.Sleep(600);
  } catch (errorMessage) {
    await console.log("WaitForDisappear(): " + identifier + " " + errorMessage);
    throw new Error("WaitForDisappear(): " + identifier + " " + errorMessage);
  }
};
exports.SwitchToMainTab=async function()
{
  var allTabs=await driver.getAllWindowHandles();
  await driver.switchTo().window(allTabs[0]);
}


exports.MouseHover=async function(identifier)
{
    try
    {

        
        let actionSequence = new webdriverActions.ActionSequence(driver);

        await  actionSequence
          .mouseMove(identifier).perform();

    }
    catch(error)
    {
        console.log(error)

    }
}

    // await driver.findElement(By.xpath(identifier)).then(async function(webElement) {
    //     await driver.actions().moveToElement(webElement).perform();
    //   });


exports.totalNumberOfXPATH=async function(identifier)
{
 var totalNumber= await driver.findElements(By.xpath(identifier));
  return totalNumber.length;

}


/**This function will click the last element, in case of multiple matching elements available in UI </br>
 * <b>Input Parameter</b>: <i>Identifier_Type </i> eg: "XPATH","ID","CLASS" etc but recommended to use "XPATH") and <i>Identifier</i> of the corresponding type) </br>
 * <b>Output</b>: If identifier is valid => Click the last element, in case of multiple matching elements available in UI. Else => Throw an error stating the failure details
 */


 exports.ClickLastElement = async function (identifierType, identifier) {
  try {
    var count = await genericHandle.GetCountOfElements(identifier);
    await genericHandle.ClickElement(
      identifierType,
      identifier + "[" + count + "]"
    );
  } catch (errorMessage) {
    await console.log(
      "WaitForDisappear(): " + identifier + "[" + count + "] " + errorMessage
    );
    throw new Error(
      "WaitForDisappear(): " + identifier + "[" + count + "] " + errorMessage
    );
  }
};

exports.CheckIfElementVisible = async function (identifier) {
  try {
    // await driver.elementIsVisible(identifier);

    await driver
      .wait(until.elementLocated(By.xpath(identifier)), 5000)
      .then(async function () {
        try {
          await driver
            .findElement(By.xpath(identifier))
            .isDisplayed()
            .then(async function (displayed) {
              if (displayed) {
                return true;
              } else {
                return false;
              }
            });
        } catch (errorMessage) {
          await console.log(errorMessage);
          return false;
        }
      });
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
exports.CheckIfElementClickable = async function(identifier){
  try {
    // await driver.elementIsVisible(identifier);
    var clickability = await driver.wait(until.elementLocated(By.xpath(identifier)), 5000)
      .then(async function () {
        try {
          await driver.findElement(By.xpath(identifier)).click();
          return true;
        } catch (errorMessage) {
          await console.log(errorMessage);
          return false;
        }
      });
      return clickability;
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
exports.WaitForElementClickable = async function (identifier) {
  try {
    // await driver.elementIsVisible(identifier);
    while ((await genericHandle.CheckIfElementClickable(identifier)) == false) {
      await genericHandle.Scroll(2);
    }
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
exports.WaitForElementVisible = async function (identifier) {
  try {
    // await driver.elementIsVisible(identifier);
    while ((await genericHandle.CheckIfElementVisible(identifier)) == false) {
      await genericHandle.Sleep(1000);
    }
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
/**This function  </br>
 * <b>Input Parameter</b>: <i>Empty</i> </br>
 * <b>Output</b>: Gracefully
 */
exports.Scroll = async function (times) {
  try {
    for (var i = 0; i < times; i++) {
      await driver
        .actions({
          bridge: true
        })
        .sendKeys(Key.ARROW_UP)
        .perform();
    }

    // await driver.findElement(By.xpath(identifier)).then(async function(webElement) {
    //     await driver.actions().moveToElement(webElement).perform();
    //   });
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
/**This function  </br>
 * <b>Input Parameter</b>: <i>Empty</i> </br>
 * <b>Output</b>: Gracefully
 */

 exports.sendEnter=async function()
 {
   await driver.actions.actions({
    bridge: true
  }).sendKeys(Key.ENTER).perform();
 }
exports.ScrollUntil = async function (identifier) {
  try {
    while ((await genericHandle.CheckIfElementVisible(identifier)) == false) {
      await driver
        .actions({
          bridge: true
        })
        .sendKeys(Key.DOWN)
        .sendKeys(Key.ARROW_DOWN)
        .perform();
    }
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
/**
 * This function will wait to load the page completely in ENV2 of UMP
 */
exports.ScrollUntilElementClickable = async function (identifier) {
  try {
    // await driver.elementIsVisible(identifier);
    while ((await genericHandle.CheckIfElementClickable(identifier)) == false) {
      await genericHandle.Scroll(2);
    }
  } catch (errorMessage) {
    await console.log("Unable to scroll: " + errorMessage);
    throw errorMessage;
  }
};
exports.WaitForActionComplete = async function () {
  // await driver.elementIsVisible("//div[@class='wait']");

  try {
    var waitElement = await genericHandle.FindIfPresent(
      "//div[text() = 'Loading...']/parent::div[not(contains(@class,'hide'))]"
    );
    while (waitElement == true) {
      await driver.sleep(600);
      waitElement = await genericHandle.FindIfPresent(
        "//div[text() = 'Loading...']/parent::div[not(contains(@class,'hide'))]"
      );
    }
    await driver.sleep(600);
  } catch (err) {
    throw err;
  }
};
/**This function  </br>
 * <b>Input Parameter</b>: <i>Empty</i> </br>
 * <b>Output</b>: Gracefully
 */
/**
 * This function recieves an identifier and wait till the element appear in UI
 */

exports.WaitForElementToAppear = async function (identifier) {
  try {
    await genericHandle.WSTWaitForActionComplete();
    await driver.wait(until.elementLocated(By.xpath(identifier)));
    await genericHandle.WSTWaitForActionComplete();
  } catch (err) {
    throw err;
  }
};
exports.EscapePopUp = async function (tempEscapePopUpIdentifier) {
  try {
    await genericHandle.ClickElement("XPATH", "//button[@class = 'mfp-close']");
  } catch (err) {
    await console.log("Element not Found!!!   " + err);
    await driver.switchTo().alert().accept();
    // await process.exit(1);
    // throw err;
  }
};
/**
 * This function will update the html close tags to log files
 */

exports.EndLog = async function() {
  await fs.appendFileSync(
    fileName,
    "</tbody>\r\n</table>\r\n</body>\r\n</html>"
  );
  await UpdateWorkFlowStatus(workFlowStatusFlag);

  try {
    await UpdateWorkFlowStatus(workFlowStatusFlag);
    await UpdateTCStatus(tcStatusFlag);
  } catch (err) {}
};

/*-----------------------------------------------------------Platform Generic functions------------------------------------------------------------------*/
/**
 * This function will Click on Go Back option in UMP
 */
exports.GoBack = async function() {
  try {
    await qmaxGenericHandle.ClickElement(
      "xpath",
      "//div[@title='Go Back'][not(@style='position: absolute; display: none;')]"
    );
    await qmaxGenericHandle.WaitForActionComplete();
  } catch (err) {
    throw err;
  }
};
/**
 * This function will Click on Reload option in UMP
 */
exports.Reload = async function() {
  try {
    await qmaxGenericHandle.ClickElement(
      "xpath",
      "//div[@title='Reload the contents'][not(@style='position: absolute; display: none;')]"
    );
    await qmaxGenericHandle.WaitForActionComplete();
  } catch (err) {
    throw err;
  }
};

/**
 * This function will automatically closes the alert box displayed
 * Alert message will be displayed in console
 */

exports.HandleAlerts = async function() {
  try {
    try {
      var alert = await driver
        .switchTo()
        .alert()
        .getText();
    } catch (err) {
      if (err.name == "NoSuchAlertError") {
        try {
          var umpAlertWindow = await qmaxGenericHandle.FindIfPresentWithoutWait(
            "//table[@class='userinfobox response']"
          );

          if (umpAlertWindow == true) {
            var umpAlertWindowText = await qmaxGenericHandle.GetTextAlertWindow(
              "//table[@class='userinfobox response']/tbody"
            );
            await qmaxGenericHandle.TakeScreenshot();

            await qmaxGenericHandle.WriteLog(
              "Verify whether any un expected alert box is displayed.",
              "No alert box should be displayed",
              false,
              "Alert message: " +
                umpAlertWindowText +
                " <br>Current page screenshot saved as " +
                screenShotName +
                ".png"
            );
            await driver
              .findElement(
                By.xpath(
                  "//div[contains(@class,'form glass')]/descendant::div[@class='env_action action_close']/div"
                )
              )
              .click();

            return umpAlertWindowText;
          } else {
            return true;
          }
        } catch (err) {}
      }
    }
    // await console.log("The Error Message is:\n" + alert);
    await driver
      .switchTo()
      .alert()
      .accept();
    return alert;
  } catch (err) {
    console.log(err);
  }
};





let PicCollection;
exports.takeScreenShot=async function(TestType)
{
  
  try 
  {
    var date=new Date();
    var date2=date.getDate();
    var month=date.getMonth();
    var year=date.getFullYear();
    var hour=date.getHours();
    var sec=date.getSeconds();
let imagepath=scrrenshotPath+TestType+date2+'_'+month+'_'+year+'_'+hour+'_'+sec+'.png';
await driver.takeScreenshot().then(async function(image,err)
{
  require ('fs'). writeFile(imagepath,image,'base64',function(err){  
   if(err){
    console.log(err)
   }
  })
    })
    return imagepath;
  }
  catch(errorMessage)
  {
    console.log(errorMessage)
   
  }



}

exports.closedBrowser=async function()
{
try{
  await driver.quit();
}
catch(errorMessage)
{

  console.log(errorMessage)
}
};

/*---------------------------------------------------------------------File Processing------------------------------------------------------------------------*/
/**This function compares the csv files provided and generates a comparison result on the log file </br>
 * <b>Input Parameter</b>: <i>File_Path_1</i> Path to the baseline file <i>File_Path_2</i> Path to the actual file to be compared </br>
 * <b>Output</b>: Gracefully
 */





 
exports.CompareCSV = async function (filePath1, filePath2) {
  var fileLineArray1 = await fs.readFileSync(filePath1, "utf8");
  var fileLineArray2 = await fs.readFileSync(filePath2, "utf8");
  fileLineArrayCount1 = await fileLineArray1.length;
  fileLineArrayCount2 = await fileLineArray2.length;
  if (fileLineArrayCount1 != fileLineArrayCount2) {
    await genericHandle.WriteLog(
      "Verify the number of lines in the file.",
      "Mismatch in number Of Lines!!. Verify Files!!",
      false
    );
    await console.log("Mismatch in number Of Lines!!. Verify Files!!");
  } else {
    await console.log("Number of Lines in File : " + file1LineArrayCount);
    var result = await genericHandle.CompareSingleDimensionalArray(
      fileLineArray1,
      fileLineArray2
    );
  }
};
/**
 * This function will convert a PDF file to a Text file with the help of a PDF Parser
 * It receives the Input File Path and destination to save the result as input
 * Once the conversion is completed, the data will be written in the destination
 */
exports.ConvertPdfToText = async function (source, destination) {
  var pdfParser = new PDFParser(this, 1);
  await pdfParser.loadPDF(source, async function (err) {
    await console.log(err);
  });
  await pdfParser.on("pdfParser_dataError", errData =>
    console.error(errData.parserError)
  );
  await pdfParser.on("pdfParser_dataReady", async function (pdfData) {
    await fs.writeFile(
      destination,
      pdfParser.getRawTextContent(),
      async function (err) {
        await console.log(err);
      }
    );
  });
};
/**
 * This function is used to write the comparison result in the form of a HTML output
 */
exports.WriteComparisonResult = async function (comparisonResult, output) {
  await console.log(comparisonResult.length);
  var result = diff.prettyHtml(comparisonResult).toString();
  result = await result
    .toString()
    .replace(/<ins>/g, '<ins><font size="3" color="green"><b>')
    .replace(/<\/ins>/g, "</b></font></ins>")
    .replace(/<del>/g, '<del><font size="3" color="red"><b>')
    .replace(/<\/del>/g, "</b></font></del>");
  var finalOutput =
    "<html><body><table><tr><td><h1>Comparison Result</h1></td></tr><tr><tr><td><b>Number of differences = " +
    comparisonResult.length +
    '</b></td></tr><tr><td style="align-content: top;" >' +
    result +
    "</td></tr></table></body></html>";

  var temp = await result.toString().split("----------------Page");
  await console.log(temp.length);
  var updatedOutput =
    '<html><body><table border="1" bgcolor="#FAE4DF"><tr><td bgcolor="#011338" align="center"><h1><font color="#ffffff">Comparison Result <font></h1></td></tr><tr><tr><td><b>Number of differences = ' +
    comparisonResult.length +
    "</b></td></tr>";
  for (var i = 0; i < temp.length; i++) {
    updatedOutput = updatedOutput + "<tr><td>" + temp[i] + "</td></tr>";
  }
  updatedOutput = updatedOutput + "</table></body></html>";
  await fs.writeFile(output, updatedOutput, async function (err) {
    if (err) await console.log(err);
  });
};
/**
 * This function will compare 2 PDF files and returns the response in the form of a HTML file
 * It receives the Source File Path, Destination File Path and the location to save the result as input
 * It then converts the PDFs into text file and performs the comparison.
 * Once the comparison is completed, the data will be written in the destination as a html file
 */
exports.ComparePdfFiles = async function (compareFile1, compareFile2, output) {
  try {
    await genericHandle.ConvertPdfToText(compareFile1, "./content1.txt");
    await genericHandle.ConvertPdfToText(compareFile2, "./content2.txt");
    var textContent1 = await fs.readFileSync("./content1.txt", "utf-8");
    var textContent2 = await fs.readFileSync("./content2.txt", "utf-8");
    var comparisonResult = await diff.main(textContent1, textContent2);
    await genericHandle.WriteComparisonResult(comparisonResult, output);
  } catch (err) {
    throw err;
  }
};
/**
 * This function will read the excel file and convert to JSON and return the JSON object
 * Recieves parameter - path to excel and the sheet number to read
 */
exports.ReadExcelData = async function (path, sheetNumber) {
  try {
    var workbook = XLSX.readFile(path);
    var sheetNameList = workbook.SheetNames;
    var excelData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetNameList[sheetNumber]]
    );
    return excelData;
  } catch (err) {
    throw err;
  }
};
/**
 * This function will compare 2 excel files and write the result in the format of an excel file.
 * It receives the Source File Path, Destination File Path and the location to save the result as input
 * Then it formats the data into a multidimentional array and compared the data
 * Once the comparison is completed, the result will be written in the destination as an excel file.
 */
exports.CompareExcelData = async function (
  sourcePath,
  destinationPath,
  resultPath
) {
  try {
    var sourceData = await genericHandle.ReadExcelData(sourcePath, 0);
    var destinationData = await genericHandle.ReadExcelData(destinationPath, 0);
    var formattedSourceData = [];
    var formattedDestinationData = [];
    for (var i = 0; i < sourceData.length; i++) {
      await formattedSourceData.push([JSON.stringify(sourceData[i])]);
      await formattedDestinationData.push([JSON.stringify(destinationData[i])]);
    }
    var resultData = await genericHandle.CompareArray(
      formattedSourceData,
      formattedDestinationData
    );
    if (resultData != true) {
      await genericHandle.WriteToExcel(resultData, "ERROR", resultPath);
    }
  } catch (err) {
    throw err;
  }
};
/**
 * This function will read the excel file and convert to JSON and return the JSON as Array
 * Recieves parameter - path to excel
 */
exports.ReadExcelDataWithoutJson = async function (path) {
  try {
    var workbook = XLSX.readFile(path);
    var resultArray = [];
    var objectCollection = [];
    var sheetNameList = workbook.SheetNames;

    var objectCollection = workbook.Sheets[sheetNameList[0]];

    delete objectCollection["!ref"];
    delete objectCollection["!margins"];

    return objectCollection;
  } catch (err) {
    throw err;
  }
};

/**
 * This function will read the excel file and convert to JSON and return the JSON object
 * Recieves parameter - path to excel and the sheet name to read
 */

exports.ExcelToJsonConvertor = async function (path, sheetName) {
  try {
    var workbook = XLSX.readFile(path);
    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return excelData;
  } catch (err) {
    throw err;
  }
};
/**
 * This is a generic function which will extract the value of the given attribute from the current UI
 * This function receives the Identifier and Attribute as input and provides the value as output.
 */
exports.GetAttribute = async function (tempGetAttributeIdentifier, attribute) {
  try {
    var value = "";
    await driver
      .findElement(By.xpath(tempGetAttributeIdentifier))
      .then(async function (element) {
        value = await element.getAttribute(attribute);
      });
    return value;
  } catch (err) {
    throw err;
  }
};
/**
 * This function compare two values and return the result of comparison
 * If both values are same, then "true" will be returned
 * If both values are not same, then "false" will be returned
 */

exports.CompareTwoValues = async function (field1, field2) {
  try {
    var result = false;
    if (field1 == field2) {
      result = true;
    }
    return result;
  } catch (err) {
    throw err;
  }
};

/**
 * This function compare two values and return the result of comparison
 * If value1 is present in value2, then "true" will be returned
 * else "false" will be returned
 */

exports.StringContainString = async function (field1, field2) {
  var result = false;

  if (field1.indexOf(field2) != -1) {
    result = true;
  }
  return result;
};

/**
 * This function compare two arrays and return the result of comparison
 * If the length of both the arrays are different then it will return the length difference
 * If both arrays are same, then "true" will be returned
 * If both values are not same, then the list of mismatches will be returned
 */

exports.CompareArray = async function (sourceArray, destinationArray) {
  try {
    var compareResult;
    var resultArray = [];
    if (sourceArray.length === destinationArray.length) {
      await resultArray.push(["SOURCE VALUE", "DESTINATION VALUE"]);
    } else {
      await resultArray.push([
        "The Length of Source Array is " + sourceArray.length,
        "The Length of Destination Array is " + destinationArray.length
      ]);
      return resultArray;
    }
    for (var i = 0; i < sourceArray.length; i++) {
      for (var j = 0; j < sourceArray[i].length; j++) {
        if (
          sourceArray[i][j].constructor == Array &&
          destinationArray[i][j].constructor == Array
        ) {
          for (var k = 0; k < sourceArray[i][j].length; k++) {
            compareResult = await genericHandle.CompareTwoValues(
              sourceArray[i][j][k],
              destinationArray[i][j][k]
            );
            if (compareResult === false) {
              await resultArray.push([sourceArray[i], destinationArray[i]]);
            }
          }
        } else {
          compareResult = await genericHandle.CompareTwoValues(
            sourceArray[i][j],
            destinationArray[i][j]
          );
        }
        if (compareResult === false) {
          await resultArray.push([sourceArray[i], destinationArray[i]]);
        }
      }
    }
    if (resultArray.length === 1) {
      return true;
    } else {
      return resultArray;
    }
  } catch (err) {
    throw err;
  }
};
/* This function compare two arrays and return the result of comparison
 * If both arrays are same, then "true" will be returned
 * If both values are not same, then an error message with the list of mismatches will be thrown
 */
exports.CompareSingleDimensionalArray = async function (
  sourceArray,
  destinationArray
) {
  try {
    var compareResult = true;
    var resultArray = [];
    for (var j = 0; j < destinationArray.length; j++) {
      if (sourceArray[j] != destinationArray[j]) {
        compareResult = false;
        await genericHandle.WriteLog(
          " ",
          "",
          false,
          "Mismatch in Records!!!.Verify Line Number " +
          j +
          ". Compared Records are " +
          sourceArray[j] +
          " and " +
          destinationArray[j]
        );
        await console.log(
          "Mismatch in Records!!!. Verify Line Number " +
          j +
          ". Compared Records are " +
          sourceArray[j] +
          " and " +
          destinationArray[j]
        );
      } else {
        await console.log(
          "Successfully Compared " +
          sourceArray[j] +
          " and " +
          destinationArray[j]
        );
        compareResult = true;
      }
    }
    return compareResult;
  } catch (err) {
    await console.log(err);
  }
};

/**
 * This function will write excel based on input recieved
 * Accepts parameters - data to write, sheet name and path to write the excel
 */

exports.WriteToExcel = async function (data, sheetName, path) {
  try {
    var wb = {};
    wb.Sheets = {};
    wb.Props = {};
    wb.SSF = {};
    wb.SheetNames = [];

    /* create worksheet: */
    var ws = {};

    /* the range object is used to keep track of the range of the sheet */
    var range = {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: 0
      }
    };
    /* Iterate through each element in the structure */
    for (var R = 0; R != data.length; ++R) {
      if (range.e.r < R) range.e.r = R;
      for (var C = 0; C != data[R].length; ++C) {
        if (range.e.c < C) range.e.c = C;

        /* create cell object: .v is the actual data */
        var cell = {
          v: data[R][C]
        };
        if (cell.v == null) continue;

        /* create the correct cell reference */
        var cell_ref = XLSX.utils.encode_cell({
          c: C,
          r: R
        });

        /* determine the cell type */
        if (typeof cell.v === "number") cell.t = "n";
        else if (typeof cell.v === "boolean") cell.t = "b";
        else cell.t = "s";

        /* add to structure */
        ws[cell_ref] = cell;
      }
    }
    ws["!ref"] = XLSX.utils.encode_range(range);

    /* add worksheet to workbook */
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;

    /* write file */
    XLSX.writeFile(wb, path);
  } catch (err) {
    throw err;
  }
};
exports.AppendToExcel = async function (data, sheetName, path) {
  try {
    var wb = {};
    wb.Sheets = {};
    wb.Props = {};
    wb.SSF = {};
    wb.SheetNames = [];

    /* create worksheet: */
    var ws = {};

    /* the range object is used to keep track of the range of the sheet */
    var range = {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: 0
      }
    };
    /* Iterate through each element in the structure */
    for (var R = 0; R != data.length; ++R) {
      if (range.e.r < R) range.e.r = R;
      for (var C = 0; C != data[R].length; ++C) {
        if (range.e.c < C) range.e.c = C;

        /* create cell object: .v is the actual data */
        var cell = {
          v: data[R][C]
        };
        if (cell.v == null) continue;

        /* create the correct cell reference */
        var cell_ref = XLSX.utils.encode_cell({
          c: C,
          r: R
        });

        /* determine the cell type */
        if (typeof cell.v === "number") cell.t = "n";
        else if (typeof cell.v === "boolean") cell.t = "b";
        else cell.t = "s";

        /* add to structure */
        ws[cell_ref] = cell;
      }
    }
    ws["!ref"] = XLSX.utils.encode_range(range);

    /* add worksheet to workbook */
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;

    /* write file */
    XLSX.utils.book_append_sheet(wb, path);
  } catch (err) {
    throw err;
  }
};
exports.WriteToExcelRowWise = async function (data, sheetName, path) {
  try {
    var wb = {};
    wb.Sheets = {};
    wb.Props = {};
    wb.SSF = {};
    wb.SheetNames = [];

    /* create worksheet: */
    var ws = {};

    /* the range object is used to keep track of the range of the sheet */
    var range = {
      s: {
        c: 0,
        r: 0
      },
      e: {
        c: 0,
        r: 0
      }
    };
    /* Iterate through each element in the structure */
    for (var R = 0; R != data.length; ++R) {
      if (range.e.r < R) range.e.r = R;
      for (var C = 0; C != data[R].length; ++C) {
        if (range.e.c < C) range.e.c = C;

        /* create cell object: .v is the actual data */
        var cell = {
          v: data[C][R]
        };
        if (cell.v == null) continue;

        /* create the correct cell reference */
        var cell_ref = XLSX.utils.encode_cell({
          c: C,
          r: R
        });

        /* determine the cell type */
        if (typeof cell.v === "number") cell.t = "n";
        else if (typeof cell.v === "boolean") cell.t = "b";
        else cell.t = "s";

        /* add to structure */
        ws[cell_ref] = cell;
      }
    }
    ws["!ref"] = XLSX.utils.encode_range(range);

    /* add worksheet to workbook */
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;

    /* write file */
    XLSX.writeFile(wb, path);
  } catch (err) {
    throw err;
  }
};

exports.GetWindowHandles = async function () {
  try {
    var windowHandles = await driver.getAllWindowHandles();
    return windowHandles;
  } catch (err) {
    throw err;
  }
};

exports.SwitchToWindows = async function (windowHandle) {
  try {
    await driver.switchTo().window(windowHandle);
    await driver
      .manage()
      .window(windowHandle)
      .maximize();
  } catch (err) {
    await console.log(err);
    throw err;
  }
};
exports.SwitchToDefaultWindow = async function () {
  try {
    await driver.switchTo().defaultcontent();
  } catch (err) {
    await console.log(err);
    throw err;
  }
};

/*----------------------------------------------------------------Logger-------------------------------------------------------------------------------*/

let fileName = "";
/**
 * This is a generic function used to create a directory if it doesn't exists in the current perspective
 * It receives the path to the directory/folder as input
 * Then it validates whether the folder is available
 * If the file is not available, then it creates a new directory at the same path provided
 */
exports.CreateDirectory = async function (dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  } catch (err) {
    await console.log(err);
  }
};
/**
 * This function will initialize the log file for workflow
 * It recieves the workflowId,moduleName,typeName,environment information as parameters
 */
let wrkID;

exports.InitializeLog=async function (
  workflowID,
  workFlowDescription,
  moduleName,
  typeName,
  environment
) {
  try {

    wrkID=workflowID;
   
    fileName =
      logFilePAth + workflowID + date .replace(/-/g, "_") .replace(/:/g, "_") .replace(/ /g, "_")  .replace("/", "_")  .replace("/", "_").replace("/", "_") + ".html";
    var userName = await process.env["USERPROFILE"].split("\\")[2];
    var currentDate = new Date();
    var htmlHeadinitialization =
      '<html>\r\n<head>\r\n<section>\r\n  <!--for demo wrap-->\r\n  <script>\r\n  // ".tbl-content" consumed little space for vertical scrollbar, scrollbar width depend on browser/os/platfrom. Here calculate the scollbar width .\r\n  $(window).on("load resize ", function() {\r\n    var scrollWidth = $(".tbl-content").width() - $(".tbl-content table").width();\r\n    $(".tbl-header").css({"padding-right":scrollWidth});\r\n}).resize();\r\n</script>\r\n  <style>\r\n\r\n  h1{\r\n    font-size: 30px;\r\n    color: #000B23;\r\n    text-transform: uppercase;\r\n    font-weight: 300;\r\n    text-align: center;\r\n    margin-bottom: 1px;\r\n  }\r\n  table{\r\n    width:100%;\r\n    table-layout: fixed;\r\n  }\r\n  .tbl-header{\r\n    background-color: #030246;\r\n   }\r\n  .tbl-content{\r\n    height:600px;\r\n    overflow-x:auto;\r\n    margin-top: 0px;\r\n    border: 1px solid rgba(255,255,255,0.3);\r\n    background-color : #FFFFFF;\r\n  }\r\n    .tbl-contentWorkFlow{\r\n        height:auto;\r\n        overflow-x:auto;\r\n        margin-top: 0px;\r\n        overflow-x:auto;\r\n        border: 1px solid rgba(255,255,255,0.3);\r\n        background-color : #FFFFFF;\r\n  }\r\n   .tbl-tbody{\r\n    height:auto;\r\n        overflow-x:auto;\r\n        margin-top: 0px;\r\n      border: 1px solid rgba(255,255,255,0.3);\r\n      background-color: #FFFFFF;\r\n    }\r\n  th{\r\n    padding: 10px 15px;\r\n    text-align: left;\r\n    font-weight: 500;\r\n    font-weight: bold;\r\n    font-size: 12px;\r\n    color: #000B23;\r\n    text-transform: uppercase;\r\n    color : #FFFFFF;\r\n  }\r\n  td{\r\n    padding: 10px;\r\n    text-align: left;\r\n    vertical-align:middle;\r\n    font-weight: 300;\r\n    font-size: 15px;\r\n    color: #000B23;\r\n    border-bottom: solid 1px rgba(255,255,255,0.1);\r\n    word-wrap:break-word;\r\n  }\r\n*.sl\r\n{\r\nwidth:30px;\r\n}\r\n*.summarySL\r\n{\r\nwidth:30px;\r\n}\r\n*.summaryPOD\r\n{\r\nwidth:200px;\r\n}\r\n*.summaryModuleName\r\n{\r\nwidth:300px;\r\n}\r\n*.pod\r\n{\r\nwidth:100px;\r\n}\r\n\r\n\r\n\r\n*.inputSpec,*.outputSpec\r\n{\r\n  width:30%;\r\n}\r\n*.moduleName\r\n{\r\nwidth:150px;\r\n}\r\n*.workFlowID\r\n{\r\nwidth:100px;\r\n}\r\n*.workFlowDescription\r\n{\r\nwidth:390px;\r\n}\r\n\r\n*.workflowDescriptionHeader\r\n{\r\n  width:14.28%;\r\n}\r\n*.status\r\n{\r\nwidth:80px;\r\n}\r\n*.remarks\r\n{\r\n}\r\n\r\n  /* demo styles */\r\n\r\n  @import url(https://fonts.googleapis.com/css?family=Roboto:400,500,300,700);\r\n  body{\r\n    background: -webkit-linear-gradient(left, #25c481, #25b7c4);\r\n    background: linear-gradient(to right, #FFFFFF, #FFFFFF);\r\n    font-family: "Garamond", sans-serif;\r\n  }\r\n  section{\r\n    margin: 30px;\r\n  }\r\n\r\n\r\n  /* follow me template */\r\n  .made-with-love {\r\n    margin-top: 40px;\r\n    padding: 10px;\r\n    clear: left;\r\n    text-align: center;\r\n    font-size: 10px;\r\n    font-family: arial;\r\n    color: #000B23;\r\n  }\r\n  .made-with-love i {\r\n    font-style: normal;\r\n    color: #F50057;\r\n    font-size: 14px;\r\n    position: relative;\r\n    top: 2px;\r\n  }\r\n  .made-with-love a {\r\n    color: #000B23;\r\n    text-decoration: none;\r\n  }\r\n  .made-with-love a:hover {\r\n    text-decoration: underline;\r\n  }\r\n\r\n\r\n  /* for custom scrollbar for webkit browser*/\r\n\r\n  ::-webkit-scrollbar {\r\n      width: 6px;\r\n  }\r\n  ::-webkit-scrollbar-track {\r\n      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\r\n  }\r\n  ::-webkit-scrollbar-thumb {\r\n      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\r\n}\r\n</style>\r\n</section>\r\n</head>\r\n<h1 id="moduleName">' +
      typeName +
      '</h1>\r\n        <div class="tbl-header">\r\n\r\n     <table id="status" cellpadding="0" cellspacing="2" border="1">\r\n\t      <thead>\r\n\t        <tr>\r\n\t          <th>WorkFlow ID</th>\r\n\t          <th>WorkFlow Status</th>\r\n\r\n\t          <th>POD</th>\r\n\t          <th>Environment</th>\r\n\t          \t          <th>Executed By</th>\r\n\t          <th>Execution Date</th>\r\n\t          \t          <th>Browser</th>\r\n\t        </tr>\r\n\t      </thead>\r\n\r\n\t      <tbody class="tbl-tbody">\r\n\t\t  \t        <tr>\r\n\t\t  \t          <td id="testCaseID">${testCaseID}</td>\r\n\t\t  \t          <td id="tcStatus">${tcStatus} </td>\r\n\r\n\t\t  \t          <td id="pod">${pod}</td>\r\n\t\t  \t          <td id="tcEnv">${tcEnv}</td>\r\n\t\t  \t             <td id="tcOwner">${tcOwner}</td>\r\n\t\t  \t          <td id="tcDate">${tcDate}</td>\r\n\t\t  \t           <td id="tcBrowser">${tcBrowser}</td>\r\n        </tr>\r\n        </tbody>\r\n    </table>\r\n    </div><br>\r\n  <div class="tbl-contentWorkFlow">\r\n  <table cellpadding="0" cellspacing="0" border="2"><tr class="tbl-header">\r\n            <th class="workflowDescriptionHeader">WorkFlow Description:</td>\r\n            <td class="tbl-contentWorkFlow" id="workFlowDescription">${workFlowDescription}</td>\r\n          </tr>\r\n          </table>\r\n          </div>\r\n          </table><br>\r\n  <div class="tbl-header">\r\n    <table cellpadding="0" cellspacing="0" border="1">\r\n      <thead>\r\n        <tr>\r\n          <th class="sl">Sl#</th>\r\n\t            <th class="inputSpec">Input Specification</th>\r\n\t            <th class="outputSpec">Output Specification</th>\r\n\t            <th class="status">Status</th>\r\n          <th class="remarks">Remarks</th>\r\n        </tr>\r\n      </thead>\r\n    </table>\r\n  </div>\r\n\r\n  <div class="tbl-content">\r\n    <table cellpadding="0" cellspacing="0" border="1">';

    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${testCaseID}",
      workflowID
    );
    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${workFlowDescription}",
      workFlowDescription
    );
    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${pod}",
      moduleName
    );
    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${tcOwner}",
      userName
    );
    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${tcEnv}",
      environment
    );
    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${tcBrowser}",
      "Chrome"
    );
    htmlHeadinitialization = await htmlHeadinitialization.replace(
      "${tcDate}",
      currentDate.toLocaleDateString() + " " + currentDate.toLocaleTimeString()
    );
    
    await fs.writeFile(fileName, htmlHeadinitialization, function (err) {
      if (err) return console.log(err);
      //   console.log('Hello World > helloworld.txt');
    });
   
    // await genericHandle.Sleep(2000);
  } catch (err) {
    throw err;
  }
};
var n = 0;
var increment = async function () {
  return function () {
    n += 1;
    return n;
  };
};

let tcStatusFlag = "Passed";
let workFlowStatusFlag = "Passed";

exports.getWorkID=async function(){
  return wrkID;
}
/**
 * This function will write the test case/test step information to log file
 * Works with four parameters - input specification, output specification, status and remarks
 * If function is called with two parameters, then its considered as test case line
 * If function is called with more than two parameters, then its considered as test step line
 * Test Step number will be auto generated for each test case
 * Test Case status will be auto filled based on each test step status for that test case
 */
exports.WriteLog = async function (ipSepc, opSpec, status, remarks,imageAssignPath) {
  try {
  
    // await genericHandle.WaitForActionComplete();
    var htmlBody =
      '<tr bgcolor="${trbgcolor}">\r\n<td class="sl">${sl}</td>\r\n          <td class="inputSpec">${inputSpec}</td>\r\n          <td class="outputSpec">${outputSpec}</td>\r\n          <td class="status" bgcolor="${bgcolor}">${status}</td>\r\n          <td class="remarks">${remarks}</td>\r\n       <td class="ScreenShot"><a href="${imageAssignPath}">click to download screenshot</a></td> \r\n        </tr>';
    if (status != null) {
      htmlBody = await htmlBody.replace("${sl}", await increment());

      if (status == true) {
        htmlBody = await htmlBody.replace("${trbgcolor}", "#FFFFFF");
        htmlBody = await htmlBody.replace("${bgcolor}", "#A6DDA4");
        htmlBody = await htmlBody.replace("${status}", "Passed");
        htmlBody = await htmlBody.replace("${imageAssignPath}", imageAssignPath);
      } else if (status == false) {
        htmlBody = await htmlBody.replace("${trbgcolor}", "#FFFFFF");
        htmlBody = await htmlBody.replace("${bgcolor}", "#FF8080");
        htmlBody = await htmlBody.replace("${status}", "Failed");
        htmlBody = await htmlBody.replace("${imageAssignPath}", imageAssignPath);
        workFlowStatusFlag = "Failed";
        tcStatusFlag = "Failed";
      } else if (status == "Mismatch") {
        htmlBody = await htmlBody.replace("${trbgcolor}", "#FFFFFF");

        htmlBody = await htmlBody.replace("${bgcolor}", "#FFE680");
        htmlBody = await htmlBody.replace("${status}", "Mismatch");
        workFlowStatusFlag = "Failed";
        tcStatusFlag = "Failed";
      }
      htmlBody = await htmlBody.replace("${inputSpec}", ipSepc);
      htmlBody = await htmlBody.replace("${outputSpec}", opSpec);
    } else {
      htmlBody = await htmlBody.replace("${sl}", "");
      n = 0;
      htmlBody = await htmlBody.replace("${trbgcolor}", "#DCF1FC");
      htmlBody = await htmlBody.replace("${bgcolor}", "#DCF1FC");
      htmlBody = await htmlBody.replace("${status}", "${currentTcStatus}");

      htmlBody = await htmlBody.replace("${inputSpec}", ipSepc);
      htmlBody = await htmlBody.replace("${outputSpec}", opSpec);
      htmlBody = await htmlBody.replace("${imageAssignPath}", imageAssignPath);
      try {
        await UpdateTCStatus(tcStatusFlag);
      } catch (err) {
        console.log(err);
      }
    }

    if (remarks !== undefined) {
      htmlBody = await htmlBody.replace("${remarks}", remarks);
    } else {
      htmlBody = await htmlBody.replace("${remarks}", "");
    }
    // await console.log(status);
   
 
       fs.appendFileSync(fileName, htmlBody);
   if (status == false) {
      await genericHandle.ExecuteRunMode(status);
    }
  } catch (err) {
    throw err;
  }
};




exports.GetCurrentURL=async function()
{
  var url=await driver.getCurrentUrl();  
  return url;
}

/**
 * This function will decide to stop on error or continue on error
 * Parameter runMode in config file will be used for getting input
 * If "Stop On Error" is configured as runMode, then system will be hard stopped on detecting error and will not preoceed further
 * If "Continue On Error" is configured as runMode, then system will be continue to next test step on detecting error
 */

exports.ExecuteRunMode = async function () {
  try {
    var currentRunmode = runMode;
  } catch (err) {
    var currentRunmode = "";
  }
  if (currentRunmode == "Stop On Error") {
    await genericHandle.CloseServer();
  }
};
/**
 * This function will update the workflow status to log file
 * Status will be based on individual test case/test step defined in workflow
 * If any of test case/test step failed, then workflow status will be "Failed"
 * If all test case/test step Passed, then workflow status will be "Passed"
 */
var UpdateWorkFlowStatus = async function (workFlowStatus) {
  var logFileBuffer = await fs.readFileSync(fileName).toString();

  try {
    logFileBuffer = await logFileBuffer.replace("${tcStatus}", workFlowStatus);
    await fs.writeFileSync(fileName, logFileBuffer);
  } catch (err) {
    console.log(err);
  }
};

/**
 * This function will update the test case status to log file
 * Status will be based on individual test step for that test case
 * If any of test step failed, then test case status will be "Failed"
 * If all test step Passed, then test case status will be "Passed"
 */

var UpdateTCStatus = async function (UpdateTCStatusData) {
  var logFileBuffer = await fs.readFileSync(fileName).toString();
  try {
    logFileBuffer = await logFileBuffer.replace(
      "${currentTcStatus}",
      UpdateTCStatusData
    );
    tcStatusFlag = "Passed";
    await fs.writeFileSync(fileName, logFileBuffer);
  } catch (err) {
    console.log(err);
  }
};

/**
 * This function will update the html close tags to log files
 */

exports.EndLog = async function () {
  await fs.appendFileSync(
    fileName,
    "</tbody>\r\n</table>\r\n</body>\r\n</html>"
  );
  await UpdateWorkFlowStatus(workFlowStatusFlag);

  try {
    await UpdateWorkFlowStatus(workFlowStatusFlag);
    await UpdateTCStatus(tcStatusFlag);
  } catch (err) {}
};



//export default  Controller_Logic.js;