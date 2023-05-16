
let api_cont=require("../../Controller/API_Controller.js")
let controler1=require("../../Controller/Controller_Logic.js");
let API_test=async function(){

    await controler1.InitializeLog("workflowID",
    "workFlowDescription",
     "moduleName",
     "typeName",
     "environment");
  // await api_cont.GetToken("https://myutilitygenius-userauthorisation-test.azurewebsites.net/api/authentication","grant_type=password&username=TestSuperUser@grr.la&password=Password1&scope=WATERAPI");


  //  await controler1.WriteLog("ipSepc"," opSpec", true, "remarks","imageAssignPath")
   /*
   console.log(response[0].access_token)
    if(response[1]!=200)
    {
            throw Error("Status code is not matched")
    }
    else{
        console.log("Run Succesfully")
    }
    */
}

API_test();