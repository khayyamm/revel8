package com.revel8.bank.dto;

import com.revel8.bank.model.Account;
import com.revel8.bank.model.Transfer;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class Responses {

    private Responses() {}

    public record AccountResponse(String id,String owner,BigDecimal balance) {
        public static AccountResponse from(Account account) {
            return new AccountResponse(account.getId(), account.getOwner(), account.getBalance());
        }
    }

    public record TransferResponse(String toAccountId, BigDecimal amount, Instant timestamp) {
        public static TransferResponse from(Transfer t) {
            return new TransferResponse(t.toAccountId(), t.amount(), t.timestamp());
        }

        public static List<TransferResponse> fromList(List<Transfer> transfers) {
            return transfers.stream().map(TransferResponse::from).toList();
        }
    }

    public record ErrorResponse(String error) {}
}