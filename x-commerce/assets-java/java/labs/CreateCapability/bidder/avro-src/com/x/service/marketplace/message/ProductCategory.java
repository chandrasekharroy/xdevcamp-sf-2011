/**
 * Autogenerated by Avro
 * 
 * DO NOT EDIT DIRECTLY
 */
package com.x.service.marketplace.message;  
@SuppressWarnings("all")
public class ProductCategory extends org.apache.avro.specific.SpecificRecordBase implements org.apache.avro.specific.SpecificRecord {
  public static final org.apache.avro.Schema SCHEMA$ = org.apache.avro.Schema.parse("{\"type\":\"record\",\"name\":\"ProductCategory\",\"namespace\":\"com.x.service.marketplace.message\",\"fields\":[{\"name\":\"site\",\"type\":{\"type\":\"record\",\"name\":\"Site\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"name\",\"type\":\"string\"}]}},{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"parentCatId\",\"type\":\"string\"},{\"name\":\"isLeaf\",\"type\":\"boolean\"}]}");
  public com.x.service.marketplace.message.Site site;
  public java.lang.CharSequence id;
  public java.lang.CharSequence name;
  public java.lang.CharSequence parentCatId;
  public boolean isLeaf;
  public org.apache.avro.Schema getSchema() { return SCHEMA$; }
  // Used by DatumWriter.  Applications should not call. 
  public java.lang.Object get(int field$) {
    switch (field$) {
    case 0: return site;
    case 1: return id;
    case 2: return name;
    case 3: return parentCatId;
    case 4: return isLeaf;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
  // Used by DatumReader.  Applications should not call. 
  @SuppressWarnings(value="unchecked")
  public void put(int field$, java.lang.Object value$) {
    switch (field$) {
    case 0: site = (com.x.service.marketplace.message.Site)value$; break;
    case 1: id = (java.lang.CharSequence)value$; break;
    case 2: name = (java.lang.CharSequence)value$; break;
    case 3: parentCatId = (java.lang.CharSequence)value$; break;
    case 4: isLeaf = (java.lang.Boolean)value$; break;
    default: throw new org.apache.avro.AvroRuntimeException("Bad index");
    }
  }
}
