package com.revel8.bank.service;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;
import com.revel8.bank.model.Account;

@Component
public class AccountStore {
  
    private final ConcurrentHashMap<String, Account> accounts = new ConcurrentHashMap<>();

    public void save(Account account) {
        accounts.put(account.getId(), account);
    }

    public Account findById(String accountId) {
        Account account = accounts.get(accountId);
        if (account == null) {
            throw new RuntimeException("Account not found: " + accountId);
        }
        return account;
    }

    public Collection<Account> findAll() {
        return accounts.values();
    }
}
