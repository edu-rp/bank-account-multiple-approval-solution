const provider = new ethers.providers.Web3Provider(window.ethereum);
const abi = [
  "event AccountCreated(address[] owners, uint256 indexed id, uint256 timestamp)",
  "event Deposit(address indexed user, uint256 indexed accountId, uint256 value, uint256 timestamp)",
  "event Withdraw(uint256 indexed withdrawId, uint256 timestamp)",
  "event WithdrawRequested(address indexed user, uint256 indexed accountId, uint256 indexed withdrawId, uint256 amount, uint256 timestamp)",
  "function approveWithdrawl(uint256 accountId, uint256 withdrawId)",
  "function createAccount(address[] otherOwners)",
  "function deposit(uint256 accountId) payable",
  "function getAccounts() view returns (uint256[])",
  "function getApprovals(uint256 accountId, uint256 withdrawId) view returns (uint256)",
  "function getBalance(uint256 accountId) view returns (uint256)",
  "function getOwners(uint256 accountId) view returns (address[])",
  "function requestWithdrawl(uint256 accountId, uint256 amount)",
  "function withdraw(uint256 accountId, uint256 withdrawId)"
];

const address = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let contract = null;

async function createAccount() {
  await getAccess();
  const owners = document
    .getElementById("owners")
    .value.split(",")
    .filter((n) => n);
  console.log(owners);

  await contract.createAccount(owners).then(() => alert("Success")).catch(errorHandler);
}

async function viewAccounts() {
  await getAccess();
  const result = await contract.getAccounts();
  console.log(result);
  document.getElementById("accounts").innerHTML = result;
}

async function deposit() {
  await getAccess();
  const account = document
    .getElementById("depositAccount")
    .value.split(",")
    .filter((n) => n)[0];
    
  const amount = document
    .getElementById("depositAmount")
    .value.split(",")
    .filter((n) => n)[0];
  console.log(account);
  console.log(amount);

  await contract.deposit(account, {value: amount}).then(() => alert("Success")).catch(errorHandler);
}

async function withdrawalRequest() {
  await getAccess();
  const account = document
    .getElementById("withdrawalRequestAccount")
    .value.split(",")
    .filter((n) => n)[0];
    
  const amount = document
    .getElementById("withdrawalRequestAmount")
    .value.split(",")
    .filter((n) => n)[0];
  console.log(account);
  console.log(amount);

  await contract.requestWithdrawl(account, amount).then(() => alert("Request submitted")).catch(errorHandler);
}

async function approveWithdrawal() {
  await getAccess();
  const account = document
    .getElementById("withdrawalAccount")
    .value.split(",")
    .filter((n) => n)[0];
    
  const amount = document
    .getElementById("withdrawalRequest")
    .value.split(",")
    .filter((n) => n)[0];
  console.log(account);
  console.log(amount);

  await contract.approveWithdrawl(account, amount)
  .then(() => alert("Approval submitted")).catch(errorHandler);
}

async function viewOwners() {
  await getAccess();
  const account = document
    .getElementById("viewOwnersAccount")
    .value.split(",")
    .filter((n) => n)[0];
  console.log(account);

  const owners = await contract.getOwners(account);
  document.getElementById("listOwners").innerHTML = owners;
}

async function withdraw() {
  await getAccess();
  const account = document
    .getElementById("withdrawAccount")
    .value.split(",")
    .filter((n) => n)[0];
    
  const request = document
    .getElementById("withdrawRequest")
    .value.split(",")
    .filter((n) => n)[0];
  console.log(account);
  console.log(request);

  const result = await contract.withdraw(account, request).catch(errorHandler);
  console.log(result);
}

function errorHandler(error) {
  alert(error.data.message);
  console.error(error);
}

async function getAccess() {
  if (contract) return;
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  contract = new ethers.Contract(address, abi, signer);

  const eventLog = document.getElementById("events");
  contract.on("AccountCreated", (owners, id, event) => {
    eventLog.append(`Account Created: ID = ${id}, Owners = ${owners}`);
  });
}
