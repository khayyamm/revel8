package com.revel8.bank.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.revel8.bank.dto.Requests;
import com.revel8.bank.dto.Responses;
import com.revel8.bank.service.BankService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/bank")
public class BankController {

    private final BankService bankService;

    public BankController(BankService bankService) {
        this.bankService = bankService;
    }

    @PostMapping("/account")
    @ResponseStatus(HttpStatus.CREATED)
    public Responses.AccountResponse createAccount(@Valid @RequestBody Requests.CreateAccount request) {
        var account = bankService.createAccount(request.owner(), request.initialBalance());
        return Responses.AccountResponse.from(account);
    }

    @GetMapping("/accounts")
    public List<Responses.AccountResponse> getAllAccounts() {
        return bankService.getAllAccounts().stream()
                .map(Responses.AccountResponse::from)
                .toList();
    }

    @GetMapping("/account/{id}")
    public Responses.AccountResponse getAccount(@PathVariable String id) {
        var account = bankService.getAccount(id);
        return Responses.AccountResponse.from(account);
    }

    @PostMapping("/account/deposit/{id}")
    public Responses.AccountResponse deposit(@PathVariable String id,
            @Valid @RequestBody Requests.AmountRequest request) {
        var account = bankService.deposit(id, request.amount());
        return Responses.AccountResponse.from(account);
    }


    @PostMapping("/account/withdraw/{id}")
    public Responses.AccountResponse withdraw(@PathVariable String id,
            @Valid @RequestBody Requests.AmountRequest request) {
        var account = bankService.withdraw(id, request.amount());
        return Responses.AccountResponse.from(account);
    }

    @PostMapping("/account/transfer/{id}")
    public void transfer(@PathVariable String id,
            @Valid @RequestBody Requests.Transfer request) {
        bankService.transfer(id, request.toAccountId(), request.amount());
    }

     @GetMapping("/account/transfers/outgoing/{id}")
       public List<Responses.TransferResponse> getOutgoingTransfers(@PathVariable String id) {
        return Responses.TransferResponse.fromList(bankService.getOutgoingTransfers(id));
    }
}
