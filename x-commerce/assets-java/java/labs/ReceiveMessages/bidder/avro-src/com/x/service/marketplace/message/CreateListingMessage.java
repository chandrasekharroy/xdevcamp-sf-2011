/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package com.x.service.marketplace.message;  
@SuppressWarnings("all")
public class CreateListingMessage extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = org.apache.avro.Schema.parse("{\"type\":\"record\",\"name\":\"CreateListingMessage\",\"namespace\":\"com.x.service.marketplace.message\",\"fields\":[{\"name\":\"listings\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"Listing\",\"fields\":[{\"name\":\"xId\",\"type\":[\"null\",\"string\"]},{\"name\":\"marketItemId\",\"type\":[\"null\",\"string\"]},{\"name\":\"product\",\"type\":{\"type\":\"record\",\"name\":\"ProductDetails\",\"fields\":[{\"name\":\"xId\",\"type\":[\"null\",\"string\"]},{\"name\":\"sku\",\"type\":\"string\"},{\"name\":\"productId\",\"type\":[\"null\",{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"StandardProductId\",\"fields\":[{\"name\":\"type\",\"type\":{\"type\":\"enum\",\"name\":\"StandardProductIdType\",\"symbols\":[\"ISBN\",\"UPC\",\"EAN\",\"ASIN\"]}},{\"name\":\"value\",\"type\":\"string\"}]}}]},{\"name\":\"manufacturer\",\"type\":[\"null\",\"string\"]},{\"name\":\"mpn\",\"type\":[\"null\",\"string\"]},{\"name\":\"brand\",\"type\":[\"null\",\"string\"]},{\"name\":\"msrp\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"CurrencyAmount\",\"fields\":[{\"name\":\"amount\",\"type\":\"double\"},{\"name\":\"code\",\"type\":\"string\"}]}]},{\"name\":\"imageURL\",\"type\":[\"null\",{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"ProductImage\",\"fields\":[{\"name\":\"purpose\",\"type\":{\"type\":\"enum\",\"name\":\"ImagePurpose\",\"symbols\":[\"FEATURED\",\"GALLERY\",\"THUMBNAIL\"]}},{\"name\":\"locationURL\",\"type\":\"string\"}]}}]},{\"name\":\"shortDescription\",\"type\":[\"null\",\"string\"]},{\"name\":\"description\",\"type\":[\"null\",\"string\"]},{\"name\":\"condition\",\"type\":[\"null\",\"string\"]}]}},{\"name\":\"startTime\",\"type\":\"long\"},{\"name\":\"price\",\"type\":\"CurrencyAmount\"},{\"name\":\"quantity\",\"type\":\"int\"},{\"name\":\"title\",\"type\":[\"null\",\"string\"]},{\"name\":\"subTitle\",\"type\":[\"null\",\"string\"]},{\"name\":\"giftWrapAvailable\",\"type\":\"boolean\"},{\"name\":\"marketCategories\",\"type\":[\"null\",{\"type\":\"array\",\"items\":\"string\"}]},{\"name\":\"payment\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"Payment\",\"fields\":[{\"name\":\"acceptedPaymentTypes\",\"type\":[\"null\",{\"type\":\"array\",\"items\":{\"type\":\"enum\",\"name\":\"PaymentMethod\",\"symbols\":[\"AMEX\",\"CASH_ON_DELIVERY\",\"CHECK\",\"CREDIT_CARD\",\"DINERS\",\"DISCOVER\",\"ESCROW\",\"INTEGRATED_MERCHANT_CREDIT_CARD\",\"MASTERCARD\",\"MONEY_ORDER\",\"MONEY_TRANSFER\",\"MONEY_TRANSFER_IN_CHECKOUT\",\"MONEYBOOKERS\",\"PAYMATE\",\"PAYMENT_ON_PICKUP\",\"PAYMENT_SEE_DESCRIPTION\",\"PAYPAL\",\"PROPAY\",\"VISA\"]}}]},{\"name\":\"immediatePaymentRequired\",\"type\":[\"null\",\"boolean\"]},{\"name\":\"paymentInstructions\",\"type\":[\"null\",\"string\"]}]}]},{\"name\":\"shipping\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"Shipping\",\"fields\":[{\"name\":\"shippingLocaleServices\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"ShippingLocaleService\",\"fields\":[{\"name\":\"rateType\",\"type\":{\"type\":\"enum\",\"name\":\"ShippingRateType\",\"symbols\":[\"FLAT\",\"CALCULATED\",\"FREIGHT\"]}},{\"name\":\"localeType\",\"type\":{\"type\":\"enum\",\"name\":\"ShippingLocaleType\",\"symbols\":[\"DOMESTIC\",\"INTERNATIONAL\"]}},{\"name\":\"applyPromotionalShippingRule\",\"type\":\"boolean\"},{\"name\":\"shippingServiceOptions\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"ShippingServiceOption\",\"fields\":[{\"name\":\"sellerPriority\",\"type\":\"int\"},{\"name\":\"serviceName\",\"type\":\"string\"},{\"name\":\"cost\",\"type\":\"CurrencyAmount\"},{\"name\":\"additionalCost\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"packagingHandlingCost\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"surcharge\",\"type\":[\"null\",\"CurrencyAmount\"]},{\"name\":\"shipToLocations\",\"type\":[\"null\",{\"type\":\"array\",\"items\":\"string\"}]}]}}}]}}}]}]},{\"name\":\"returnPolicy\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"ReturnPolicy\",\"fields\":[{\"name\":\"description\",\"type\":[\"null\",\"string\"]},{\"name\":\"returnAccepted\",\"type\":[\"null\",\"boolean\"]},{\"name\":\"buyerPaysReturnShipping\",\"type\":[\"null\",\"boolean\"]},{\"name\":\"returnByDays\",\"type\":[\"null\",\"int\"]},{\"name\":\"refundMethod\",\"type\":[\"null\",{\"type\":\"enum\",\"name\":\"RefundMethod\",\"symbols\":[\"MONEY_BACK\",\"EXCHANGE_ONLY\",\"STORE_CREDIT\"]}]}]}]},{\"name\":\"marketSpecifics\",\"type\":[\"null\",\"bytes\"]}]}}},{\"name\":\"xProfileId\",\"type\":\"string\"}],\"topic\":\"/listing/create\"}");
  public java.util.List<com.x.service.marketplace.message.Listing> listings;
  public java.lang.CharSequence xProfileId;
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return listings;
    case 1: return xProfileId;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: listings = (java.util.List<com.x.service.marketplace.message.Listing>)value$; break;
    case 1: xProfileId = (java.lang.CharSequence)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
}
