/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package com.x.service.marketplace.message;  
@SuppressWarnings("all")
public class InitAuthorizationMessage extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = org.apache.avro.Schema.parse("{\"type\":\"record\",\"name\":\"InitAuthorizationMessage\",\"namespace\":\"com.x.service.marketplace.message\",\"fields\":[{\"name\":\"returnURL\",\"type\":[\"null\",\"string\"]},{\"name\":\"cancelURL\",\"type\":[\"null\",\"string\"]},{\"name\":\"guid\",\"type\":\"string\"}],\"topic\":\"/marketplace/authorization/init\"}");
  public java.lang.CharSequence returnURL;
  public java.lang.CharSequence cancelURL;
  public java.lang.CharSequence guid;
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return returnURL;
    case 1: return cancelURL;
    case 2: return guid;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: returnURL = (java.lang.CharSequence)value$; break;
    case 1: cancelURL = (java.lang.CharSequence)value$; break;
    case 2: guid = (java.lang.CharSequence)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
}
