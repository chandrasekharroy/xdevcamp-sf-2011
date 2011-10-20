/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package com.x.service.marketplace.message;  
@SuppressWarnings("all")
public class SiteSupportedReturnPolicyMessage extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = org.apache.avro.Schema.parse("{\"type\":\"record\",\"name\":\"SiteSupportedReturnPolicyMessage\",\"namespace\":\"com.x.service.marketplace.message\",\"fields\":[{\"name\":\"policies\",\"type\":{\"type\":\"record\",\"name\":\"SupportedReturnPolicy\",\"fields\":[{\"name\":\"returnsAccepted\",\"type\":\"boolean\"},{\"name\":\"method\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"enum\",\"name\":\"RefundMethod\",\"symbols\":[\"MONEY_BACK\",\"EXCHANGE_ONLY\",\"STORE_CREDIT\"]}}},{\"name\":\"maxReturnByDays\",\"type\":\"int\"}]}},{\"name\":\"siteCode\",\"type\":\"string\"}],\"topic\":\"/marketplace/returnPolicy/find/success\"}");
  public com.x.service.marketplace.message.SupportedReturnPolicy policies;
  public java.lang.CharSequence siteCode;
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return policies;
    case 1: return siteCode;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: policies = (com.x.service.marketplace.message.SupportedReturnPolicy)value$; break;
    case 1: siteCode = (java.lang.CharSequence)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
}
