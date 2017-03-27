// optional maximum_pages
var Wasm32FunctionWriter=function(type_index){
    this._type=type_index;
};




// export
Wasm32FunctionWriter.prototype.toUint8Array=function(){
    var output=new ResizableUint8Array();
    output.append(VLQEncoder.encodeUInt(this._type));
    return output.toUint8Array();
};