var Wasm32CodeWriter=function(local_types){
    this._localTypes=(local_types?local_types:[]); // [7e | 7f ...]
    this._data=new ResizableUint8Array();
    this._functionlinks=[]; // {location:num,name:string}
};


Wasm32CodeWriter.prototype.setName=function(name){
    this._functionname=name;
};

Wasm32CodeWriter.prototype.setType=function(type){
    this._functiontype=type;
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
    br_table:0x0E,
    return:0x0F,
    call:0x10,
    call_indirect:0x11,
    drop:0x1A,
    select:0x1B,
    get_local:0x20,
    set_local:0x21,
    tee_local:0x22,
    get_global:0x23,
    set_global:0x24,
    i32_load:0x28,
    i64_load:0x29,
    f32_load:0x2A,
    f64_load:0x2B,
    i32_load8_s:0x2C,
    i32_load8_u:0x2D,
    i32_load16_s:0x2E,
    i32_load16_u:0x2F,
    i64_load8_s:0x30,
    i64_load8_u:0x31,
    i64_load16_s:0x32,
    i64_load16_u:0x33,
    i64_load32_s:0x34,
    i64_load32_u:0x35,
    i32_store:0x36,
    i64_store:0x37,
    f32_store:0x38,
    f64_store:0x39,
    i32_store8:0x3A,
    i32_store16:0x3B,
    i64_store8:0x3C,
    i64_store16:0x3D,
    i64_store32:0x3E,
    current_memory:0x3F,
    grow_memory:0x40,
    i32_const:0x41,
    i64_const:0x42,
    f32_const:0x43,
    f64_const:0x44,
    i32_eqz:0x45,
    i32_eq:0x46,
    i32_ne:0x47,
    i32_add:0x6A,
    i32_sub:0x6B,
    i32_mul:0x6C,
};


Wasm32CodeWriter.prototype.writeRawBytes=function(){
    for(var i=0;i<arguments.length;++i){
        if(!(arguments[i]>=0 && arguments[i]<256))debugger;
        this._data.push(arguments[i]);
    }
};

Wasm32CodeWriter.prototype.writeUint8Array=function(arr){
    this._data.append(arr);
};



// control instructions
Wasm32CodeWriter.prototype.unreachable=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.unreachable);
};

Wasm32CodeWriter.prototype.nop=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.nop);
};

Wasm32CodeWriter.prototype.block=function(result_type){
    this.writeRawBytes(Wasm32CodeWriter.instruction.block,result_type);
};

Wasm32CodeWriter.prototype.loop=function(result_type){
    this.writeRawBytes(Wasm32CodeWriter.instruction.loop,result_type);
};

Wasm32CodeWriter.prototype.if=function(result_type){
    this.writeRawBytes(Wasm32CodeWriter.instruction.if,result_type);
};

Wasm32CodeWriter.prototype.else=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.else);
};

Wasm32CodeWriter.prototype.end=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.end);
};

Wasm32CodeWriter.prototype.br=function(relative_depth){
    this.writeRawBytes(Wasm32CodeWriter.instruction.br);
    this.writeUint8Array(VLQEncoder.encodeUInt(relative_depth));
};

Wasm32CodeWriter.prototype.br_if=function(relative_depth){
    this.writeRawBytes(Wasm32CodeWriter.instruction.br_if);
    this.writeUint8Array(VLQEncoder.encodeUInt(relative_depth));
};

Wasm32CodeWriter.prototype.return=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.return);
};

Wasm32CodeWriter.prototype.call=function(function_index_or_name){
    if(typeof function_index_or_name === "number"){
        this.writeRawBytes(Wasm32CodeWriter.instruction.call);
        this.writeUint8Array(VLQEncoder.encodeUInt(function_index_or_name));
    }
    else{
        this.writeRawBytes(Wasm32CodeWriter.instruction.call);
        this._functionlinks.push({location:this._data.size(),name:function_index_or_name});
    }
};

Wasm32CodeWriter.prototype.drop=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.drop);
};

Wasm32CodeWriter.prototype.select=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.select);
};




// variable instructions
Wasm32CodeWriter.prototype.get_local=function(localidx){
    this.writeRawBytes(Wasm32CodeWriter.instruction.get_local);
    this.writeUint8Array(VLQEncoder.encodeUInt(localidx));
};

Wasm32CodeWriter.prototype.set_local=function(localidx){
    this.writeRawBytes(Wasm32CodeWriter.instruction.set_local);
    this.writeUint8Array(VLQEncoder.encodeUInt(localidx));
};

Wasm32CodeWriter.prototype.tee_local=function(localidx){
    this.writeRawBytes(Wasm32CodeWriter.instruction.tee_local);
    this.writeUint8Array(VLQEncoder.encodeUInt(localidx));
};




// memory instructions
Wasm32CodeWriter.prototype.i32_load=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_load);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.f32_load=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.f32_load);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.f64_load=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.f64_load);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_load8_s=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_load8_s);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_load8_u=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_load8_u);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_load16_s=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_load16_s);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_load16_u=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_load16_u);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load8_s=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load8_s);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load8_u=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load8_u);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load16_s=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load16_s);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load16_u=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load16_u);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load32_s=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load32_s);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_load32_u=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_load32_u);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_store=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_store);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_store=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_store);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.f32_store=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.f32_store);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.f64_store=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.f64_store);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_store8=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_store8);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i32_store16=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_store16);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_store8=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_store8);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_store16=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_store16);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.i64_store32=function(offset,log_align){
    log_align=log_align||0;
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_store32);
    this.writeUint8Array(VLQEncoder.encodeUInt(log_align));
    this.writeUint8Array(VLQEncoder.encodeUInt(offset));
};

Wasm32CodeWriter.prototype.current_memory=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.current_memory,0);
};

Wasm32CodeWriter.prototype.grow_memory=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.grow_memory,0);
};



// numeric instructions
Wasm32CodeWriter.prototype.i32_const=function(val_i32){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_const);
    this.writeUint8Array(VLQEncoder.encodeInt(val_i32));
};

Wasm32CodeWriter.prototype.i64_const=function(val_i64){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i64_const);
    this.writeUint8Array(VLQEncoder.encodeInt(val_i64));
};


Wasm32CodeWriter.prototype.i32_eqz=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_eqz);
};

Wasm32CodeWriter.prototype.i32_eq=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_eq);
};

Wasm32CodeWriter.prototype.i32_ne=function(){
    this.writeRawBytes(Wasm32CodeWriter.instruction.i32_ne);
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
    output.append(VLQEncoder.encodeUInt(this._localTypes.length));
    for(var i=0;i<this._localTypes.length;++i){
        output.push(1);
        output.push(this._localTypes[i]);
    }
    output.append(this._data.toUint8Array());
    output.insert_arr(0,VLQEncoder.encodeUInt(output.size()));
    return output.toUint8Array();
};

