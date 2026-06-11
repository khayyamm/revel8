package com.revel8.bank.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;


public class Account {
    private static final int MAX_OUTGOING_TRANSFERS = 50;

    private final String id;
    private final String owner;
    private final AtomicReference<BigDecimal> balance;

    private final Transfer[] transferRingBuffer = new Transfer[MAX_OUTGOING_TRANSFERS];
    private int ringHead = 0;
    private int ringSize = 0;

    public Account(String owner, BigDecimal initialBalance) {
        this.id = UUID.randomUUID().toString();
        this.owner = owner;
        this.balance = new AtomicReference<>(initialBalance);
    }

    public String getId() {
        return id;
    }

    public String getOwner() {
        return owner;
    }

    public BigDecimal getBalance() {
        return balance.get();
    }

    public void adjustBalance(BigDecimal amount) {
        balance.updateAndGet(current -> current.add(amount));
    }

    public boolean compareAndSetBalance(BigDecimal expected, BigDecimal newBalance) {
        return balance.compareAndSet(expected, newBalance);
    }

    public synchronized void recordOutgoingTransfer(Transfer transfer) {
        transferRingBuffer[ringHead] = transfer;
        ringHead = (ringHead + 1) % MAX_OUTGOING_TRANSFERS;
        if (ringSize < MAX_OUTGOING_TRANSFERS) {
            ringSize++;
        }
    }

    public synchronized List<Transfer> getOutgoingTransfers() {
       List<Transfer> result = new ArrayList<>(ringSize);
        if (ringSize < MAX_OUTGOING_TRANSFERS) {
            for (int i = 0; i < ringSize; i++) {
                result.add(transferRingBuffer[i]);
            }
        } else {
            for (int i = 0; i < MAX_OUTGOING_TRANSFERS; i++) {
                result.add(transferRingBuffer[(ringHead + i) % MAX_OUTGOING_TRANSFERS]);
            }
        }
        return result;

    }
}


