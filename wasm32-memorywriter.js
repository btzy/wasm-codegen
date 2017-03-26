// optional maximum_pages
var Wasm32MemoryWriter=function(initial_pages,maximum_pages){
    this._initial_pages=initial_pages;
    if(maximum_pages)this._maximum_pages=maximum_pages;
};




// export
Wasm32MemoryWriter.prototype.toUint8Array=function(){
    var output=new ResizableUint8Array();
    if(this._maximum_pages){
        output.push(1);
        output.append(VLQEncoder.encodeUInt(this._initial_pages));
        output.append(VLQEncoder.encodeUInt(this._maximum_pages));
    }
    else{
        output.push(0);
        output.append(VLQEncoder.encodeUInt(this._initial_pages));
    }
    return output.toUint8Array();
};