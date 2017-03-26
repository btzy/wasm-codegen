var Wasm32TypeWriter=function(param_types,result_types){
    this._param_types=(param_types?param_types:[]); // [7e | 7f ...]
    this._result_types=(result_types?result_types:[]);
};



// export
Wasm32TypeWriter.prototype.toUint8Array=function(){
    var output=new ResizableUint8Array();
    output.push(0x60); // func
    output.append(VLQEncoder.encode(this._param_types.length));
    for(var i=0;i<this._param_types.length;++i){
        output.push(this._param_types[i]);
    }
    output.append(VLQEncoder.encode(this._result_types.length));
    for(var i=0;i<this._result_types.length;++i){
        output.push(this._result_types[i]);
    }
    return output.toUint8Array();
};