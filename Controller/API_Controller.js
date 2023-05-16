
//const fetch = require('node-fetch-native')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let token;
let responseStatus;
exports.GetCall=async function(url){

	try{
	let response=await  fetch(url,{
			method:"GET",
			headers:{
			"Content-Type":"application/json; charset=utf-8"	
			}
		}).then(async response=>{
			responseStatus=await response.status;
			return await response.json().then(async body=>{
				return body;
				
			})
			
		})	
return [response,responseStatus];

	}
	catch(error){
		console.log("GET call error: "+error)
	}

}

let statusOfRequest;
exports.GetToken=async function(url,data){

	let response=await fetch(url,{
		method:"POST",
		headers:{
			"Content-Type":"application/json; charset=utf-8"
		},
		body:data

	}).then(async response=>{
		responseStatus=await response.status;
		return await response.json(async body=>{
			return body;
		})
	})

	return [response,responseStatus]
}


exports.PostCall=async function(url,data){

	let response=await fetch(url,{
		method:"POST",
		authorization:token,
		headers:{
			"Content-Type":"application/json; charset=utf-8"
		},
		body:data

	}).then(async response=>{
		responseStatus=await response.status;
		return await response.json(async body=>{
			return body;
		})
	})

	return [response,responseStatus]
}



exports.PostCall=async function(url,data){

	let response=await fetch(url,{
		method:"PUT",
		headers:{
			"Content-Type":"application/json; charset=utf-8"
		},
		body:data

	}).then(async response=>{
		responseStatus=await response.status;
		return await response.json(async body=>{
			return body;
		})
	})

	return [response,responseStatus]
}



exports.PostCall=async function(url,data){

	let response=await fetch(url,{
		method:"DELETE",
		headers:{
			"Content-Type":"application/json; charset=utf-8"
		},
		body:data

	}).then(async response=>{
		responseStatus=await response.status;
		return await response.json(async body=>{
			return body;
		})
	})

	return [response,responseStatus]
}


