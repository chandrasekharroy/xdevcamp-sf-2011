package com.x.devcamp.bidder;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpHeaders;
import org.apache.http.HttpStatus;

import com.x.devcamp.auction.Bid;
import com.x.devcamp.common.AvroEncDecoder;
import com.x.service.marketplace.message.Listing;

public class ConsoleServlet extends HttpServlet {
    /**
     * 
     */
    private static final long serialVersionUID = -4215385468088927789L;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String authToken = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (!"Bearer QlVTRk9SQVVUSElELTEA7/GRzPeAKiymgVsONHEikg==".equals(authToken)) {
            resp.sendError(HttpStatus.SC_UNAUTHORIZED, "Invalid Authorization token");
            return;
        }
        String tenantId = req.getHeader("X-XC-TENANT-ID");
        String messageGuid = req.getHeader("X-XC-MESSAGE-GUID");
        byte[] data = getMessageBody(req);
        String topic = req.getRequestURI();
        if (topic.indexOf("/bid/") > -1) {
            Bid bid = AvroEncDecoder.decode(data, Bid.SCHEMA$);
            System.out.println("[" + messageGuid + "][" + tenantId + "] " + topic + ": " + bid.listingId + " -> " + bid.bidAmount);
        } else if (topic.indexOf("/auction/") > -1) {
            Listing listing = AvroEncDecoder.decode(data, Listing.SCHEMA$);
            System.out.println("[" + messageGuid + "][" + tenantId + "] " + topic + ": " + listing.xId + ":" + listing.title + " -- $" + listing.price.amount);
        } else {
            System.out.println("[" + messageGuid + "][" + tenantId + "] " + topic + ": Rogue message");
        }
    }

    private static byte[] getMessageBody(HttpServletRequest request) throws IOException {
        int length = request.getContentLength();
        if (length < 0) {
            length = 4096;
        }
        ByteArrayOutputStream baos = new ByteArrayOutputStream(length);
        byte[] buffer = new byte[length];
        int n;
        InputStream in = request.getInputStream();
        while ((n = in.read(buffer)) > 0) {
            baos.write(buffer, 0, n);
        }
        return baos.toByteArray();
    }
}
