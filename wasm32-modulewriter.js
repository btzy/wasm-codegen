var Wasm32ModuleWriter=function(){
    this._types=[];
    this._functions=[];
    this._exports=[];
    this._codes=[];
};

Wasm32ModuleWriter.sectionCode={
    TYPE:0x01,
    FUNCTION:0x03,
    EXPORT:0x07,
    CODE:0x0a
};

var encodeString=function(str){
    return new TextEncoder().encode(str);
};

Wasm32ModuleWriter.prototype.addLogicalFunction=function(logical_function){
    var typeIndex=this._types.length;
    var funcIndex=this._functions.length;
    this._types.push(logical_function._type);
    var function_def=new Uint8Array(1);
    function_def[0]=typeIndex;
    this._functions.push(function_def);
    this._codes.push(logical_function._code);
    if(logical_function._exportName){
        var encoded_name=encodeString(logical_function._exportName);
        var export_def=new Uint8Array(encoded_name.length+3);
        export_def[0]=encoded_name.length;
        for(var i=0;i<encoded_name.length;++i){
            export_def[i+1]=encoded_name[i];
        }
        export_def[encoded_name.length+1]=0;
        export_def[encoded_name.length+2]=funcIndex;
        this._exports.push(export_def);
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
        output.push(0); // dummy for size
        output.push(this._types.length);
        for(var i=0;i<this._types.length;++i){
            output.append(this._types[i]);
        }
        output.set(sizeloc,output.size()-sizeloc-1);
    }
    
    // FUNCTION
    if(this._functions.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.FUNCTION);
        var sizeloc=output.size();
        output.push(0); // dummy for size
        output.push(this._functions.length);
        for(var i=0;i<this._functions.length;++i){
            output.append(this._functions[i]);
        }
        output.set(sizeloc,output.size()-sizeloc-1);
    }
    
    // EXPORT
    if(this._exports.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.EXPORT);
        var sizeloc=output.size();
        output.push(0); // dummy for size
        output.push(this._exports.length);
        for(var i=0;i<this._exports.length;++i){
            output.append(this._exports[i]);
        }
        output.set(sizeloc,output.size()-sizeloc-1);
    }
    
    // CODE
    if(this._codes.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.CODE);
        var sizeloc=output.size();
        output.push(0); // dummy for size
        output.push(this._codes.length);
        for(var i=0;i<this._codes.length;++i){
            output.append(this._codes[i]);
        }
        output.set(sizeloc,output.size()-sizeloc-1);
    }
    
    return output.toUint8Array();
};
