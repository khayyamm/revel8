package com.revel8.bank.dto;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;


public final class Requests {

    private Requests() {}

    public record CreateAccount(
            @NotBlank(message = "owner must not be blank")
            String owner,

            @NotNull(message = "initialBalance is required")
            @DecimalMin(value = "0.00", message = "initialBalance must be >= 0")
            BigDecimal initialBalance
    ) {}

    public record AmountRequest(
            @NotNull(message = "amount is required")
            @DecimalMin(value = "0.01", message = "amount must be positive")
            BigDecimal amount
    ) {}

    public record Transfer(
            @NotBlank(message = "toAccountId must not be blank")
            String toAccountId,

            @NotNull(message = "amount is required")
            @DecimalMin(value = "0.01", message = "amount must be positive")
            BigDecimal amount
    ) {}
}