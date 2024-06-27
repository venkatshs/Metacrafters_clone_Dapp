import React, { useEffect, useState } from "react";
import contract from "./contracts/StackUp.json";
import { ethers } from "ethers";
import "./App.css"; // Import your CSS file for styling

const contractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = contract.abi;

function App() {
  const [adminAddr, setAdminAddr] = useState("nil");
  const [currentAccount, setCurrentAccount] = useState(null);
  const [allQuestsInfo, setAllQuestsInfo] = useState(null);
  const [userQuestStatuses, setUserQuestStatuses] = useState(null);
  const [questId, setQuestId] = useState(null);

  const connectWalletHandler = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setCurrentAccount(accounts[0]);
        console.log("found an account:", accounts[0]);
      } catch (err) {
        console.log(err);
      }
    } else {
      // MetaMask not installed
      console.log("please install metamask");
    }
  };

  const getAdminAddr = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const stackupContract = new ethers.Contract(contractAddr, abi, provider);

      const adminAddr = await stackupContract.admin();
      setAdminAddr(adminAddr);
    } catch (err) {
      console.log("getAdminAddr error...");
      console.log(err);
    }
  };

  const getQuestsInfo = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const stackupContract = new ethers.Contract(contractAddr, abi, provider);

      const nextQuestId = await stackupContract.nextQuestId();
      let allQuestsInfo = [];
      for (let i = 0; i < nextQuestId; i++) {
        let thisQuest = await stackupContract.quests(i);
        allQuestsInfo.push(thisQuest);
      }
      setAllQuestsInfo(allQuestsInfo);
    } catch (err) {
      console.log("getQuestsInfo error...");
      console.log(err);
    }
  };

  const getUserQuestStatuses = async () => {
    try {
      if (currentAccount) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const stackupContract = new ethers.Contract(
          contractAddr,
          abi,
          provider
        );

        const nextQuestId = await stackupContract.nextQuestId();
        const questStatusMapping = {
          0: "Not Joined",
          1: "Joined",
          2: "Submitted",
        };
        let userQuestStatuses = [];
        for (let i = 0; i < nextQuestId; i++) {
          let thisQuestStatus = [];
          let thisQuest = await stackupContract.quests(i);
          let thisQuestTitle = thisQuest[2];
          let thisQuestId = thisQuest[0];

          thisQuestStatus.push(thisQuestTitle);
          const questStatusId = await stackupContract.playerQuestStatuses(
            currentAccount,
            thisQuestId
          );
          thisQuestStatus.push(questStatusMapping[questStatusId]);

          userQuestStatuses.push(thisQuestStatus);
        }
        setUserQuestStatuses(userQuestStatuses);
      }
    } catch (err) {
      console.log("getUserQuestStatuses error...");
      console.log(err);
    }
  };

  const joinQuestHandler = async () => {
    try {
      if (!questId) {
        alert("input quest ID before proceeding");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const stackupContract = new ethers.Contract(contractAddr, abi, signer);
        const tx = await stackupContract.joinQuest(questId);
        await tx.wait();
      }
    } catch (err) {
      console.log(err);
      alert("error encountered! refer to console log to debug");
    }
  };

  const submitQuestHandler = async () => {
    try {
      if (!questId) {
        alert("input quest ID before proceeding");
      } else {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const stackupContract = new ethers.Contract(contractAddr, abi, signer);
        const tx = await stackupContract.submitQuest(questId);
        await tx.wait();
      }
    } catch (err) {
      console.log(err);
      alert("error encountered! refer to console log to debug");
    }
  };

  useEffect(() => {
    getAdminAddr();
    getQuestsInfo();
    getUserQuestStatuses();
  });

  return (
    <div className="container">
      <h1 className="title">Metakrafters Clone</h1>
      {currentAccount ? (
        <h4 className="wallet">Wallet connected: {currentAccount}</h4>
      ) : (
        <button className="button" onClick={connectWalletHandler}>
          Connect Wallet
        </button>
      )}
      <h4 className="admin">Admin address: {adminAddr}</h4>
      <h2 className="section-title">
        <u>All Courses:</u>
      </h2>

      <div className="quests">
        {allQuestsInfo &&
          allQuestsInfo.map((quest) => {
            return (
              <div key={quest[0]} className="quest">
                <h4>{quest[2]}</h4>
                <ul>
                  <li>CourseId: {quest[0].toString()}</li>
                  <li>Number of Participants: {quest[1].toString()}</li>
                  <li>reward: {quest[3].toString()}</li>
                  <li>number of rewards available: {quest[4].toString()}</li>
                </ul>
              </div>
            );
          })}
      </div>
      <h2 className="section-title">
        <u>Your Course Status:</u>
      </h2>
      <div className="quest-statuses">
        <ul>
          {userQuestStatuses &&
            userQuestStatuses.map((quest, index) => {
              return (
                <div key={index}>
                  <li>
                    {quest[0]} - {quest[1]}
                  </li>
                </div>
              );
            })}
        </ul>
      </div>
      <h2 className="section-title">
        <u>Actions:</u>
      </h2>
      <div className="actions">
        <input
          type="text"
          placeholder="Course Id"
          value={questId}
          onChange={(e) => setQuestId(e.target.value)}
          className="input"
        />
        <button className="button" onClick={joinQuestHandler}>
          Join Course
        </button>
        <button className="button" onClick={submitQuestHandler}>
          Submit Course
        </button>
      </div>
    </div>
  );
}

export default App;
