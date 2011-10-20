/*
Copyright (c) 2011, X.Commerce

All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the 
following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following
disclaimer.  Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the
following disclaimer in the documentation and/or other materials provided with the distribution.  Neither the name of
the nor the names of its contributors may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.x.devcamp.common;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.avro.Schema;
import org.apache.avro.file.DataFileReader;
import org.apache.avro.file.DataFileWriter;
import org.apache.avro.file.SeekableByteArrayInput;
import org.apache.avro.file.SeekableInput;
import org.apache.avro.generic.IndexedRecord;
import org.apache.avro.specific.SpecificDatumReader;
import org.apache.avro.specific.SpecificDatumWriter;

public class AvroEncDecoder {
    public static <T extends IndexedRecord> byte[] encode(T message, Schema schema) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream(4096);
        SpecificDatumWriter<T> writer = new SpecificDatumWriter<T>(schema);
        DataFileWriter<T> dfw = null;
        try {
            dfw = new DataFileWriter<T>(writer).create(schema, baos);
            dfw.append(message);
        } finally {
            if (dfw != null) {
                dfw.close();
            }
        }
        return baos.toByteArray();
    }

    public static <T extends IndexedRecord> T decode(byte[] data, Schema schema) throws IOException {
        SpecificDatumReader<T> reader = new SpecificDatumReader<T>(schema);
        SeekableInput in = new SeekableByteArrayInput(data);
        DataFileReader<T> dfr = null;
        T result = null;
        try {
            dfr = new DataFileReader<T>(in, reader);
            result = dfr.next();
        } finally {
            if (dfr != null) {
                dfr.close();
            }
        }
        return result;
    }
}
