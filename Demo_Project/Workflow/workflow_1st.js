
let controller=require("../../Controller/Controller_Logic.js");
let validateTheCounrOfjourney=require("../Pages/Validate_data.js")
let openBrowser=async function(){
    
try{
    await controller.LaunchServer("1","hello","moduleName"," typeName","https://ttc.com/")
    await validateTheCounrOfjourney.validateTheTotalJpourneys();
    let screenshot= await controller.takeScreenShot("test");
    await controller.WriteLog("ipSepc","opSpec",true,"Updared remark",screenshot);
    console.log("Sucessfully run the test!!!!!!!!!!!");
}
catch(error){
     throw new Error("failed to perform 1st task :"+error)
}
}

openBrowser();
