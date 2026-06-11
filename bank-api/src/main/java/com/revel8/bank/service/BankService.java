package com.revel8.bank.service;
import com.revel8.bank.model.Account;
import com.revel8.bank.model.Transfer;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;


@Service
public class BankService {

    private final AccountStore store;

    public BankService(AccountStore store) {
        this.store = store;
    }

    public Account createAccount(String owner, BigDecimal initialBalance) {
        requirePositiveOrZero(initialBalance);
        Account account = new Account(owner, initialBalance);
        store.save(account);
        return account;
    }
 
    public Account deposit(String accountId, BigDecimal amount) {
        requirePositive(amount);
        Account account = store.findById(accountId);
        account.adjustBalance(amount);
        return account;
    } 

    public Account withdraw(String accountId, BigDecimal amount) {
        requirePositive(amount);
        Account account = store.findById(accountId);
      
        while (true) {
            BigDecimal current = account.getBalance();
            if (current.compareTo(amount) < 0) {
                throw new RuntimeException("Insufficient funds: " + current + " < " + amount);
            }
            BigDecimal next = current.subtract(amount);          
            if (balanceCAS(account, current, next)) {
                break;
            }
        }
        return account;
    }

    public void transfer(String fromId, String toId, BigDecimal amount) {
        requirePositive(amount);
        if (fromId.equals(toId)) {
            throw new RuntimeException("Source and destination account must differ");
        }

        Account from = store.findById(fromId);
        Account to   = store.findById(toId);
     
        Account first  = fromId.compareTo(toId) < 0 ? from : to;
        Account second = fromId.compareTo(toId) < 0 ? to   : from;

        synchronized (first) {
            synchronized (second) {
                BigDecimal fromBalance = from.getBalance();
                if (fromBalance.compareTo(amount) < 0) {
                    throw new RuntimeException("Insufficient funds: " + fromBalance + " < " + amount);
                }
                from.adjustBalance(amount.negate());
                to.adjustBalance(amount);
                from.recordOutgoingTransfer(new Transfer(toId, amount, Instant.now()));
            }
        }
    }
 
    public Account getAccount(String accountId) {
        return store.findById(accountId);
    }

    public List<Account> getAllAccounts() {
        return store.findAll().stream().toList();
    }

    public List<Transfer> getOutgoingTransfers(String accountId) {
        Account account = store.findById(accountId);
        return account.getOutgoingTransfers();
    }
  
    private boolean balanceCAS(Account account, BigDecimal expected, BigDecimal next) {
        return account.compareAndSetBalance(expected, next);
    }

    private void requirePositive(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Amount must be positive: " + amount);
        }
    }

    private void requirePositiveOrZero(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("Amount must be positive or zero: " + amount);
        }
    }
}