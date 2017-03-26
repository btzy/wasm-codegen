var Wasm32ModuleWriter=function(){
    this._types=[];
    this._functions=[];
    this._memory=[];
    this._exports=[];
    this._codes=[];
};

Wasm32ModuleWriter.sectionCode={
    TYPE:0x01,
    IMPORT:0x02,
    FUNCTION:0x03,
    TABLE:0x04,
    MEMORY:0x05,
    GLOBAL:0x06,
    EXPORT:0x07,
    START:0x08,
    ELEMENT:0x09,
    CODE:0x0A,
    DATA:0x0B,
};

Wasm32ModuleWriter.prototype.addLogicalFunction=function(logical_function){
    var typeIndex=this._types.length;
    var funcIndex=this._functions.length;
    this._types.push(logical_function._type);
    this._functions.push(VLQEncoder.encodeUInt(typeIndex));
    this._codes.push(logical_function._code);
    if(logical_function._exportName){
        var encodeUIntd_name=encodeUIntString(logical_function._exportName);
        var export_def=new ResizableUint8Array();
        export_def.append(VLQEncoder.encodeUInt(encodeUIntd_name.length));
        export_def.append(encodeUIntd_name);
        export_def.push(0);
        export_def.append(VLQEncoder.encodeUInt(funcIndex));
        this._exports.push(export_def.toUint8Array());
    }
};



Wasm32ModuleWriter.prototype.generateModule=function(){
    var output=new ResizableUint8Array();
    
    var wasm_header=new Uint8Array(8);
    wasm_header[0]=0x00;
    wasm_header[1]=0x61;
    wasm_header[2]=0x73;
    wasm_header[3]=0x6d;
    wasm_header[4]=0x01;
    wasm_header[5]=0x00;
    wasm_header[6]=0x00;
    wasm_header[7]=0x00;
    
    output.append(wasm_header);
    
    // TYPE
    if(this._types.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.TYPE);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._types.length));
        for(var i=0;i<this._types.length;++i){
            output.append(this._types[i]);
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // FUNCTION
    if(this._functions.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.FUNCTION);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._functions.length));
        for(var i=0;i<this._functions.length;++i){
            output.append(this._functions[i]);
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // EXPORT
    if(this._exports.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.EXPORT);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._exports.length));
        for(var i=0;i<this._exports.length;++i){
            output.append(this._exports[i]);
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // CODE
    if(this._codes.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.CODE);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._codes.length));
        for(var i=0;i<this._codes.length;++i){
            output.append(this._codes[i]);
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    return output.toUint8Array();
};
