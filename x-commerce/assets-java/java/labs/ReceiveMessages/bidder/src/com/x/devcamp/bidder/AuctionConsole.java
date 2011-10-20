package com.x.devcamp.bidder;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;

import javax.servlet.Servlet;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.handler.ContextHandlerCollection;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.servlet.ServletHolder;
import org.mortbay.jetty.webapp.WebAppContext;
import org.mortbay.resource.FileResource;

public class AuctionConsole extends Server {
    private WebAppContext mainContext;

    public AuctionConsole(int portNum) throws MalformedURLException, IOException, URISyntaxException {
        mainContext = new WebAppContext();
        mainContext.setContextPath("/");

        ContextHandlerCollection contexts = new ContextHandlerCollection();
        this.setHandler(contexts);
        mainContext.setBaseResource(new FileResource(new File(".").toURI().toURL()));
        contexts.addHandler(mainContext);

        Connector connector = new SelectChannelConnector();
        connector.setPort(portNum);
        addConnector(connector);
        mainContext.setConnectorNames(new String[] { connector.getName() });
    }

    void addServlet(String path, Servlet handler) {
        ServletHolder requestServlet = new ServletHolder(handler);
        mainContext.addServlet(requestServlet, path);
    }

    public static void main(String[] args) throws Exception {
        AuctionConsole server = new AuctionConsole(9000);
        server.addServlet("/*", new ConsoleServlet());
        server.start();
    }

}
