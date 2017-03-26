var Wasm32ImportWriter=function(module,field,kind){
    this._module=module;
    this._field=field;
    this._kind=kind;
};


Wasm32ImportWriter.writeType=function(type_uint8arr){
    this._type=type_uint8arr;
}


// export
Wasm32ImportWriter.prototype.toUint8Array=function(){
    var output=new ResizableUint8Array();
    var module_bytes=encodeUIntString(this._module);
    var field_bytes=encodeUIntString(this._field);
    output.push(VLQEncoder.encodeUInt(module_bytes.length));
    output.append(module_bytes);
    output.push(VLQEncoder.encodeUInt(field_bytes.length));
    output.append(field_bytes);
    output.push(this._kind);
    output.append(this._type);
    return output.toUint8Array();
};