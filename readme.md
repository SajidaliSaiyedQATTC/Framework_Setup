Automation Testing for webbrowser and API.
*********************************************************************************************************************************************************************************

Getting Started
You need to install  Node on your machine. In this project, I will use node  for installing packages and running scripts.

**********************************************************************************************************************************************************************************

Documentation:
Installation
1. Introduction:
    This is just an unofficial guide to show you how to install the dependencies for running UI automation and API test with Selenium and JavaScript.
2. Start your project
    npm init 
3. Install dependencies
    npm install 


*********************************************************************************************************************************************************************************
Project Structure: 
Page  Object Model: I am using the page object model: Page Object Model, also known as POM, is a design pattern in Selenium that creates an object repository for storing all web elements. It helps reduce code duplication and improves test case maintenance.

Controller:
    1. Controller_Logic.js: This file contains different selenium methods. Like open browser, click element , find element etc etc. 
    2. API_Controller.js  This file contents differnt API testing methods. Like Getcall, Post, Put Petch and Delete. 

Demo_project: It is your main project folder. 
    1. Download: It contains log files and scrrenshot
    2. Page: individuals Page's Logic
    3. Workflow: This is your test suits.

node_modules: It is node's module or system  module. 

config.js: This is your  project configuration file. In this file you can setup your all project path

package-lock.json: package-lock. json is automatically generated for any operations where npm modifies either the node_modules tree, or package. json

package.json : The package. json file contains descriptive and functional metadata about a project, such as a name, version, and dependencies.


*********************************************************************************************************************************************************************************

To Run Project:
    1. npm run UI_Test
    2. npm run Api_test

    