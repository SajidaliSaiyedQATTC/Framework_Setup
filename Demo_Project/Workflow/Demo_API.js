let api_cont=require("../../Controller/API_Controller")
let controler1=require("../../Controller/Controller_Logic.js");




let API_test=async function(){

    await controler1.InitializeLog("workflowID",
    "workFlowDescription",
     "moduleName",
     "typeName",
     "environment");


    let response= await api_cont.GetCall("https://cat-fact.herokuapp.com/facts/")


    if(response[1]==200){
        await controler1.WriteLog("ipSepc"," opSpec", true, "remarks","imageAssignPath")
    }
    else{
        await controler1.WriteLog("ipSepc"," opSpec", false, "remarks","imageAssignPath")
        throw new Error("Status is not macthed");
    }
   
    console.log("Sucessfully run the test!!!!!!!!!!!");
}

API_test();