package com.farmxchain.backend.service;

import com.farmxchain.backend.contracts.CropRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.gas.StaticGasProvider;

import java.math.BigInteger;

@Service
public class BlockchainService {

    private final Web3j web3j;
    private final Credentials credentials;

    @Value("${blockchain.contract-address}")
    private String contractAddress;

    private final BigInteger GAS_PRICE = BigInteger.valueOf(20_000_000_000L);
    private final BigInteger GAS_LIMIT = BigInteger.valueOf(4_300_000);

    public BlockchainService(Web3j web3j, Credentials credentials) {
        this.web3j = web3j;
        this.credentials = credentials;
    }

    public CropRegistry loadContract() {
        return CropRegistry.load(
                contractAddress,
                web3j,
                credentials,
                new StaticGasProvider(GAS_PRICE, GAS_LIMIT)
        );
    }

    public void transferOwnership(Long cropId, String newOwnerAddress) throws Exception {
        CropRegistry contract = loadContract();
        contract.transferOwnership(BigInteger.valueOf(cropId), newOwnerAddress).send();
    }
}
