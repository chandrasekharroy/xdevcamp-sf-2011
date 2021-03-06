/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package com.x.service.marketplace.message;  
@SuppressWarnings("all")
public class OrderUpdate extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = org.apache.avro.Schema.parse("{\"type\":\"record\",\"name\":\"OrderUpdate\",\"namespace\":\"com.x.service.marketplace.message\",\"fields\":[{\"name\":\"marketOrderId\",\"type\":\"string\"},{\"name\":\"processed\",\"type\":[\"null\",\"boolean\"]},{\"name\":\"orderShipmentUpdate\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"OrderShipmentUpdate\",\"fields\":[{\"name\":\"shipmentId\",\"type\":\"string\"},{\"name\":\"trackingDetails\",\"type\":{\"type\":\"array\",\"items\":{\"type\":\"record\",\"name\":\"TrackingDetail\",\"fields\":[{\"name\":\"trackingNumber\",\"type\":\"string\"},{\"name\":\"carrier\",\"type\":[\"null\",\"string\"]},{\"name\":\"service\",\"type\":[\"null\",\"string\"]}]}}}]}]}]}");
  public java.lang.CharSequence marketOrderId;
  public java.lang.Boolean processed;
  public com.x.service.marketplace.message.OrderShipmentUpdate orderShipmentUpdate;
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return marketOrderId;
    case 1: return processed;
    case 2: return orderShipmentUpdate;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: marketOrderId = (java.lang.CharSequence)value$; break;
    case 1: processed = (java.lang.Boolean)value$; break;
    case 2: orderShipmentUpdate = (com.x.service.marketplace.message.OrderShipmentUpdate)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
}
