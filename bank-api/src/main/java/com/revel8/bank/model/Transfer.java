package com.revel8.bank.model;

import java.math.BigDecimal;
import java.time.Instant;

public record Transfer(String toAccountId,BigDecimal amount,Instant timestamp) {}

