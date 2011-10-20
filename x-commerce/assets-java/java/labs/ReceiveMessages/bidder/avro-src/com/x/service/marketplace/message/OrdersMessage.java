/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package com.x.service.marketplace.message;  
@SuppressWarnings("all")
public class OrdersMessage extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = org.apache.avro.Schema.parse("{\"type\":\"record\",\"name\":\"OrdersMessage\",\"namespace\":\"com.x.service.marketplace.message\",\"fields\":[{\"name\":\"orders\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"Order\",\"fields\":[{\"name\":\"orderTime\",\"type\":\"long\"},{\"name\":\"channel\",\"type\":\"string\"},{\"name\":\"marketOrderId\",\"type\":\"string\"},{\"name\":\"customer\",\"type\":{\"type\":\"record\",\"name\":\"CustomerInfo\",\"fields\":[{\"name\":\"userMarketId\",\"type\":[\"null\",\"string\"]},{\"name\":\"email\",\"type\":[\"null\",\"string\"]},{\"name\":\"name\",\"type\":[\"null\",\"string\"]},{\"name\":\"phone\",\"type\":[\"null\",\"string\"]}]}},{\"name\":\"items\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"OrderItem\",\"fields\":[{\"name\":\"marketListingId\",\"type\":\"string\"},{\"name\":\"listingURL\",\"type\":\"string\"},{\"name\":\"status\",\"type\":\"string\"},{\"name\":\"sku\",\"type\":\"string\"},{\"name\":\"quantity\",\"type\":\"int\"},{\"name\":\"taxAmount\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"CurrencyAmount\",\"fields\":[{\"name\":\"amount\",\"type\":\"double\"},{\"name\":\"code\",\"type\":\"string\"}]}]},{\"name\":\"discountAmount\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"shipmentId\",\"type\":\"string\"},{\"name\":\"giftWrap\",\"type\":[\"null\",\"boolean\"]},{\"name\":\"giftWrapText\",\"type\":[\"null\",\"string\"]},{\"name\":\"variations\",\"type\":[\"null\",{\"type\":\"map\",\"values\":\"string\"}]},{\"name\":\"marketSpecifics\",\"type\":[\"null\",\"bytes\"]}]}}},{\"name\":\"totalTaxAmount\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"totalDiscountAmount\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"totalAmount\",\"type\":\"CurrencyAmount\"},{\"name\":\"status\",\"type\":\"string\"},{\"name\":\"paymentMethod\",\"type\":{\"type\":\"enum\",\"name\":\"PaymentMethod\",\"symbols\":[\"AMEX\",\"CASH_ON_DELIVERY\",\"CHECK\",\"CREDIT_CARD\",\"DINERS\",\"DISCOVER\",\"ESCROW\",\"INTEGRATED_MERCHANT_CREDIT_CARD\",\"MASTERCARD\",\"MONEY_ORDER\",\"MONEY_TRANSFER\",\"MONEY_TRANSFER_IN_CHECKOUT\",\"MONEYBOOKERS\",\"PAYMATE\",\"PAYMENT_ON_PICKUP\",\"PAYMENT_SEE_DESCRIPTION\",\"PAYPAL\",\"PROPAY\",\"VISA\"]}},{\"name\":\"shipments\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"Shipment\",\"fields\":[{\"name\":\"shipmentId\",\"type\":\"string\"},{\"name\":\"address\",\"type\":{\"type\":\"record\",\"name\":\"Address\",\"fields\":[{\"name\":\"street1\",\"type\":\"string\"},{\"name\":\"street2\",\"type\":[\"null\",\"string\"]},{\"name\":\"city\",\"type\":\"string\"},{\"name\":\"county\",\"type\":[\"null\",\"string\"]},{\"name\":\"stateOrProvince\",\"type\":\"string\"},{\"name\":\"country\",\"type\":\"string\"},{\"name\":\"postalCode\",\"type\":\"string\"}]}},{\"name\":\"shippingServiceOption\",\"type\":{\"type\":\"record\",\"name\":\"ShippingServiceOption\",\"fields\":[{\"name\":\"sellerPriority\",\"type\":\"int\"},{\"name\":\"serviceName\",\"type\":\"string\"},{\"name\":\"cost\",\"type\":\"CurrencyAmount\"},{\"name\":\"additionalCost\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"packagingHandlingCost\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"surcharge\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"shipToLocations\",\"type\":[\"null\",{\"type\":\"array\",\"items\":\"string\"}]}]}},{\"name\":\"trackingDetails\",\"type\":[\"null\",{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"TrackingDetail\",\"fields\":[{\"name\":\"trackingNumber\",\"type\":\"string\"},{\"name\":\"carrier\",\"type\":[\"null\",\"string\"]},{\"name\":\"service\",\"type\":[\"null\",\"string\"]}]}}]},{\"name\":\"recipientName\",\"type\":[\"null\",\"string\"]}]}}},{\"name\":\"marketSpecifics\",\"type\":[\"null\",\"bytes\"]}]}}},{\"name\":\"xProfileId\",\"type\":\"string\"},{\"name\":\"filter\",\"type\":{\"type\":\"record\",\"name\":\"OrderFilter\",\"fields\":[{\"name\":\"startTime\",\"type\":\"long\"},{\"name\":\"endTime\",\"type\":[\"null\",\"long\"]},{\"name\":\"status\",\"type\":[\"null\",\"string\"]}]}}],\"topic\":\"/order/find/success\"}");
  public java.util.List<com.x.service.marketplace.message.Order> orders;
  public java.lang.CharSequence xProfileId;
  public com.x.service.marketplace.message.OrderFilter filter;
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return orders;
    case 1: return xProfileId;
    case 2: return filter;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: orders = (java.util.List<com.x.service.marketplace.message.Order>)value$; break;
    case 1: xProfileId = (java.lang.CharSequence)value$; break;
    case 2: filter = (com.x.service.marketplace.message.OrderFilter)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
}
