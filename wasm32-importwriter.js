var Wasm32ImportWriter=function(module,field,kind){
    this._module=module;
    this._field=field;
    this._kind=kind;
};


Wasm32ImportWriter.prototype.setName=function(name){
    this._functionname=name;
}

Wasm32ImportWriter.prototype.setType=function(type){
    this._functiontype=type;
};


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
    output.append(VLQEncoder.encodeUInt(this._type));
    return output.toUint8Array();
};