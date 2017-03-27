var Wasm32ExportWriter=function(field,kind,index){
    this._field=field;
    this._kind=kind;
    this._index=index;
};


Wasm32ExportWriter.prototype.setName=function(name){
    this._functionname=name;
};


// export
Wasm32ExportWriter.prototype.toUint8Array=function(){
    var output=new ResizableUint8Array();
    var encoded_field_bytes=encodeUIntString(this._field);
    output.append(VLQEncoder.encodeUInt(encoded_field_bytes.length));
    output.append(encoded_field_bytes);
    output.push(this._kind);
    output.append(VLQEncoder.encodeUInt(this._index));
    return output.toUint8Array();
};