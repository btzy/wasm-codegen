var Wasm32CodeWriter=function(local_types){
    this._localTypes=(local_types?local_types:[]); // [7e | 7f ...]
    this._data=new ResizableUint8Array();
};


Wasm32CodeWriter.instruction={
    unreachable:0x00,
    nop:0x01,
    block:0x02,
    loop:0x03,
    if:0x04,
    else:0x05,
    end:0x0B,
    br:0x0C,
    br_if:0x0D,
    return:0x0F,
    call:0x10,
    get_local:0x20,
    set_local:0x21,
    tee_local:0x22,
    i32_load:0x28,
    i32_const:0x41,
    i32_add:0x46,
    i32_add:0x6A,
    i32_sub:0x6B,
    i32_mul:0x6C,
};


Wasm32CodeWriter.prototype.writeRawBytes=function(){
    for(var i=0;i<arguments.length;++i){
        this._data.push(arguments[i]);
    }
};



// control instructions
Wasm32CodeWriter.prototype.unreachable=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.unreachable);
};

Wasm32CodeWriter.prototype.nop=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.nop);
};

Wasm32CodeWriter.prototype.end=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.end);
};

Wasm32CodeWriter.prototype.return=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.return);
};




// variable instructions
Wasm32CodeWriter.prototype.get_local=function(localidx){
    this.writeRawBytes(Wasm32CodeWriter.instruction.get_local,localidx);
};

Wasm32CodeWriter.prototype.set_local=function(localidx){
    this.writeRawBytes(Wasm32CodeWriter.instruction.set_local,localidx);
};

Wasm32CodeWriter.prototype.tee_local=function(localidx){
    this.writeRawBytes(Wasm32CodeWriter.instruction.tee_local,localidx);
};



// numeric instructions
Wasm32CodeWriter.prototype.i32_const=function(val_i32){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_const,val_i32);
};


Wasm32CodeWriter.prototype.i32_eq=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_eq);
};


Wasm32CodeWriter.prototype.i32_add=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_add);
};

Wasm32CodeWriter.prototype.i32_sub=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_sub);
};

Wasm32CodeWriter.prototype.i32_mul=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_mul);
};


// export
Wasm32CodeWriter.prototype.toUint8Array=function(){
    var output=new ResizableUint8Array();
    //output.push(0); // dummy size
    output.append(VLQEncoder.encode(this._localTypes.length));
    for(var i=0;i<this._localTypes.length;++i){
        output.push(1);
        output.push(this._localTypes[i]);
    }
    output.append(this._data.toUint8Array());
    output.insert_arr(0,VLQEncoder.encode(output.size()));
    return output.toUint8Array();
};

