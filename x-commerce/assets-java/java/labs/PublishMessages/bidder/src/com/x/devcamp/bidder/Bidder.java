package com.x.devcamp.bidder;

import java.math.BigDecimal;

import com.x.devcamp.auction.Bid;
import com.x.devcamp.common.AvroEncDecoder;
import com.x.devcamp.common.XFabricPublisher;
import com.x.service.marketplace.message.CurrencyAmount;

public class Bidder {

    public static void main(String[] args) throws Exception {
        if (args.length != 3) {
            System.err.println("usage: java com.x.devcamp.bidder.Bidder tenant listingId bidAmount");
            return;
        }
        String tenant = args[0];
        String listingId = args[1];
        BigDecimal amount = new BigDecimal(args[2]);

        Bid bid = new Bid();
        bid.bidAmount = new CurrencyAmount();
        bid.bidAmount.amount = amount.doubleValue();
        bid.bidAmount.code = "USD";
        bid.listingId = listingId;

        byte[] data = AvroEncDecoder.encode(bid, Bid.SCHEMA$);

        String tenantAuth = null;
        if ("bidder1".equals(tenant)) {
            tenantAuth = "QVVUSElELTEAuRyP8LTHzE/oooUzVdZZdQ==";
        } else {
            tenantAuth = "QVVUSElELTEAS9f0EZZjuvH+w7wQP/KM1A==";
        }

        String messageGuid = new XFabricPublisher("http://localhost:8080/").publishMessage("/bid/placed", tenantAuth, data);
        System.out.println("[" + messageGuid + "] Placed $" + amount + " bid for " + listingId + " on behalf of " + tenantAuth);
    }
}
