// script.js

class BankAccount {
    constructor(accountNumber, accountHolder, initialBalance = 0) {
      this.accountNumber = accountNumber;
      this.accountHolder = accountHolder;
      this.balance = initialBalance;
      this.transactions = [];
      this.locked = false;
    }
  
    deposit(amount) {
      if (this.locked) {
        alert(`Account ${this.accountNumber} is locked. Cannot deposit funds.`);
        return;
      }
      this.balance += amount;
      this.transactions.push(new Transaction('Deposit', amount));
      alert(`Deposited ${amount} to ${this.accountNumber}. New Balance: ${this.balance}`);
    }
  
    withdraw(amount) {
      if (this.locked) {
        alert(`Account ${this.accountNumber} is locked. Cannot withdraw funds.`);
        return;
      }
      if (amount + BankAccount.transactionFee > this.balance) {
        alert(`Insufficient funds in account ${this.accountNumber}. Withdrawal failed.`);
      } else {
        this.balance -= (amount + BankAccount.transactionFee);
        this.transactions.push(new Transaction('Withdraw', amount));
        alert(`Withdrew ${amount} from ${this.accountNumber}. New Balance: ${this.balance}`);
      }
    }
  
    transfer(amount, recipientAccount) {
      if (this.locked) {
        alert(`Account ${this.accountNumber} is locked. Cannot transfer funds.`);
        return;
      }
      if (amount + BankAccount.transactionFee > this.balance) {
        alert(`Insufficient funds in account ${this.accountNumber}. Transfer failed.`);
      } else {
        this.withdraw(amount);
        recipientAccount.deposit(amount);
        this.transactions.push(new Transaction('Transfer', amount, recipientAccount.accountNumber));
        alert(`Transferred ${amount} to ${recipientAccount.accountNumber}.`);
      }
    }
  
    getBalance() {
      return this.balance;
    }
  
    getTransactionHistory() {
      return this.transactions;
    }
  
    setLock(status) {
      this.locked = status;
      alert(`Account ${this.accountNumber} is now ${status ? 'locked' : 'unlocked'}.`);
    }
  }
  
  BankAccount.transactionFee = 1;
  
  class Transaction {
    constructor(type, amount, recipientAccount = null) {
      this.type = type;
      this.amount = amount;
      this.recipientAccount = recipientAccount;
      this.date = new Date().toLocaleString();
    }
  }
  
  class Bank {
    constructor() {
      this.accounts = new Map();
    }
  
    createAccount(accountNumber, accountHolder, initialBalance = 0) {
      if (this.accounts.has(accountNumber)) {
        alert(`Account with number ${accountNumber} already exists.`);
        return;
      }
      const newAccount = new BankAccount(accountNumber, accountHolder, initialBalance);
      this.accounts.set(accountNumber, newAccount);
      alert(`Account ${accountNumber} created successfully for ${accountHolder}.`);
    }
  
    getAccount(accountNumber) {
      return this.accounts.get(accountNumber);
    }
  }
  
  // Create a new bank instance
  const myBank = new Bank();
  
  // Function to create a new account
  function createAccount() {
    const accountNumber = document.getElementById('accountNumber').value;
    const accountHolder = document.getElementById('accountHolder').value;
    const initialBalance = parseFloat(document.getElementById('initialBalance').value);
    myBank.createAccount(accountNumber, accountHolder, initialBalance);
  }
  
  // Function to deposit amount
  function deposit() {
    const accountNumber = document.getElementById('actionAccountNumber').value;
    const amount = parseFloat(document.getElementById('actionAmount').value);
    const account = myBank.getAccount(accountNumber);
    if (account) {
      account.deposit(amount);
    } else {
      alert(`Account ${accountNumber} not found.`);
    }
  }
  
  // Function to withdraw amount
  function withdraw() {
    const accountNumber = document.getElementById('actionAccountNumber').value;
    const amount = parseFloat(document.getElementById('actionAmount').value);
    const account = myBank.getAccount(accountNumber);
    if (account) {
      account.withdraw(amount);
    } else {
      alert(`Account ${accountNumber} not found.`);
    }
  }
  
  // Function to lock/unlock account
  function lockAccount() {
    const accountNumber = document.getElementById('actionAccountNumber').value;
    const account = myBank.getAccount(accountNumber);
    if (account) {
      account.setLock(!account.locked);
    } else {
      alert(`Account ${accountNumber} not found.`);
    }
  }
  
  // Function to transfer amount between accounts
  function transfer() {
    const senderAccountNumber = document.getElementById('senderAccountNumber').value;
    const recipientAccountNumber = document.getElementById('recipientAccountNumber').value;
    const amount = parseFloat(document.getElementById('transferAmount').value);
    const senderAccount = myBank.getAccount(senderAccountNumber);
    const recipientAccount = myBank.getAccount(recipientAccountNumber);
    if (senderAccount && recipientAccount) {
      senderAccount.transfer(amount, recipientAccount);
    } else {
      alert('Invalid sender or recipient account.');
    }
  }
  
  // Function to check balance
  function checkBalance() {
    const accountNumber = document.getElementById('infoAccountNumber').value;
    const account = myBank.getAccount(accountNumber);
    if (account) {
      alert(`Balance for account ${accountNumber} is ${account.getBalance()}`);
    } else {
      alert(`Account ${accountNumber} not found.`);
    }
  }
  
  // Function to view transaction history
  function viewTransactions() {
    const accountNumber = document.getElementById('infoAccountNumber').value;
    const account = myBank.getAccount(accountNumber);
    if (account) {
      const transactions = account.getTransactionHistory();
      let output = `<h5>Transaction History for Account ${accountNumber}:</h5>`;
      transactions.forEach(transaction => {
        output += `<p>${transaction.date} - ${transaction.type}: ${transaction.amount}</p>`;
      });
      document.getElementById('output').innerHTML = output;
    } else {
      alert(`Account ${accountNumber} not found.`);
    }
  }
  