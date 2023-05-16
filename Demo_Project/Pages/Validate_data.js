let controller=require("../../Controller/Controller_Logic.js")

exports.validateTheTotalJpourneys=async function(){


    
    let totalJourneys=[];
    const jouneysXpath={
        "cookieButton":"//button[contains(text(),'Accept')]",
        "searchTripLink":"descendant::a[contains(text(),'Search Trips')][2]",
        "TotalJourneys":"//span[@class='destination']"
    }

    try{
        await controller.ClickElement(jouneysXpath.cookieButton);
        await controller.ClickElement(jouneysXpath.searchTripLink);

        let listOfTabs=await controller.GetWindowHandles();
        await controller.SwitchToWindows(listOfTabs[1]);
    
        let totalXPATH=    await controller.findAllElements(jouneysXpath.TotalJourneys);
        for(let i=0;i<totalXPATH.length;i++){
               totalJourneys[i]=await totalXPATH[i].getText() 
            
        }
      //  console.log(totalJourneys.length)
        let screenshot= await controller.takeScreenShot("test");
        if(totalXPATH.length==10){
            await controller.WriteLog("verify the mcount of total jopurneys","it is coming as expected ",true,"Updared remark",screenshot)
        }
        else{
            await controller.WriteLog("verify the count of total jopurneys","Not coming as expected  ",false,"Updared remark",screenshot)
        }
    }
    catch(error){
            console.log(error)
    }
}