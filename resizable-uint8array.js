var ResizableUint8Array=function(){
    this._buffer=new ArrayBuffer(8);
    this._data=new Uint8Array(this._buffer);
    this._size=0;
};
ResizableUint8Array.prototype.size=function(){
    return this._size;
};
ResizableUint8Array.prototype.get=function(index){
    return this._data[index];
};
ResizableUint8Array.prototype.set=function(index,value){
    this._data[index]=value;
};
ResizableUint8Array.prototype.reserve_extra=function(amount){
    if(this._size+amount>this._data.length){
        var new_buffer=new ArrayBuffer(Math.max(this._data.length*2,this._size+amount));
        var new_data=new Uint8Array(new_buffer);
        for(var i=0;i<this._size;++i){
            new_data[i]=this._data[i];
        }
        this._buffer=new_buffer;
        this._data=new_data;
    }
};
ResizableUint8Array.prototype.push=function(value){
    this.reserve_extra(1);
    this._data[this._size++]=value;
};
ResizableUint8Array.prototype.append=function(value_uint8array){
    this.reserve_extra(value_uint8array.length);
    for(var i=0;i<value_uint8array.length;++i){
        this._data[this._size++]=value_uint8array[i];
    }
};
ResizableUint8Array.prototype.pop=function(){
    return this._data[--this._size];
};
ResizableUint8Array.prototype.toUint8Array=function(){
    var ret_arr=new Uint8Array(this._size);
    for(var i=0;i<this._size;++i){
        ret_arr[i]=this._data[i];
    }
    return ret_arr;
};