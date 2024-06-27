# Metacrafters_clone_Dapp

This is a simple application in which we can join the challenges(i.eCourses) and also can submit the quests after completing them.I have used react for the frontend part


## Installation

First clone the project using this

Next open the terminal and navigagte to smart-contract directory by using 
```bash
cd smart-contract
```
Next run the below commands one by one 
```bash
  npm init --yes
  npm install --save-dev hardhat
  npx hardhat
  npx hardhat compile
```
If you get any error in the 'npx hardhat compile' command run the below command and re-run the 'npx hardhat compile' command
```bash
npm i @nomicfoundation/hardhat-toolbox
```
Next be in the smart-contract folder only and run the below command
```bash
npx hardhat node 
```
The above command will start the Hardhat network in the background.
Next go to the frontend folder by using the below command
```bash
cd frontend 
```
And install the dependencies by running the below command one after another
```bash
npm install
npm install ethers@5.7.2 --save
```
And now open the new terminal and navigate to smart contract folder and run the below command to deploy the smart contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```
The above command will run our deploy.js script in the Hardhat Network.
And next navigate to frontend folder and run the below command to start the react server
```bash
npm start
```
    
## Author : Venkateswarlu
