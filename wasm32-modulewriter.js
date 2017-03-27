var Wasm32ModuleWriter=function(){
    this._types=[]; // these are real uint8arrays.  the rest are writers
    this._imports=[];
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

/*Wasm32ModuleWriter.prototype.addLogicalFunction=function(logical_function){
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
};*/

// memory: Wasm32MemoryWriter
Wasm32ModuleWriter.prototype.setMemory=function(memory){
    // currently only 1 memory is allowed.
    this._memory=[memory];
};

// name: string, field: string (external)
Wasm32ModuleWriter.prototype.exportFunction=function(name,field){
    field=field||name;
    var exportWriter=new Wasm32ExportWriter(field,Wasm32ExternalKind.function);
    exportWriter.setName(name);
    this._exports.push(exportWriter);
};

// name: string, module: string (external), field: string (external)
Wasm32ModuleWriter.prototype.importFunction=function(name,type,module,field){
    var importWriter=new Wasm32ImportWriter(module,field,Wasm32ExternalKind.function);
    importWriter.setName(name);
    importWriter.setType(type);
    this._imports.push(importWriter);
};

// name: string, type: Wasm32TypeWriter, code: Wasm32CodeWriter
Wasm32ModuleWriter.prototype.addFunction=function(name,type,codeWriter){
    codeWriter.setName(name);
    codeWriter.setType(type);
    this._codes.push(codeWriter);
};





Wasm32ModuleWriter.prototype.generateModule=function(){
    var funcTypes=[];
    var funcTypesOffset=this._types.length;
    var funcTypesEqComp=function(type_data){
        return function(el){
            if(el.length!=type_data.length)return false;
            for(var i=0;i<el.length;++i){
                if(el[i]!=type_data[i])return false;
            }
            return true;
        };
    };
    var funcNames=[]; // {name:string, funcType:uint8array}
    var funcNamesOffset=this._functions.length;
    this._imports.forEach(function(obj){
        var name=obj._functionname;
        if(name){
            if(funcNames.findIndex(function(el){return el.name===name;})===-1)funcNames.push({name:name,funcType:obj._functiontype});
            else throw "Repeated function \""+name+"\".";
        }
    });
    this._codes.forEach(function(obj){
        var name=obj._functionname;
        if(name){
            if(funcNames.findIndex(function(el){return el.name===name;})===-1)funcNames.push({name:name,funcType:obj._functiontype});
            else throw "Repeated function \""+name+"\".";
        }
    });
    
    funcNames.forEach(function(el){
        if(funcTypes.findIndex(funcTypesEqComp(el.funcType))===-1)funcTypes.push(el.funcType);
    });
    
    // generate the types (these are NOT writers, they are uint8arrays)
    var that=this;
    funcTypes.forEach(function(type){
        that._types.push(type);
    });
    
    // generate the FunctionWriters
    var that=this;
    funcNames.forEach(function(name){
        var functionWriter=new Wasm32FunctionWriter(funcTypes.findIndex(funcTypesEqComp(name.funcType))+funcTypesOffset);
        that._functions.push(functionWriter);
    });
    
    // resolve functionlinks in code
    this._codes.forEach(function(obj){
        var functionLinks=obj._functionlinks;
        functionLinks.sort(function(a,b){
            return b.location-a.location; // sorts by location back to front
        });
        functionLinks.forEach(function(functionLink){
            var funcIndex=funcNames.findIndex(function(el){
                return el.name===functionLink.name;
            })+funcNamesOffset;
            if(funcIndex===-1)throw "Undeclared function \""+functionLink.name+"\".";
            obj._data.insert_arr(functionLink.location,VLQEncoder.encodeUInt(funcIndex));
        });
    });
    
    // resolve exports
    this._exports.forEach(function(obj){
        var name=obj._functionname;
        if(name){
            var funcIndex=funcNames.findIndex(function(el){
                return el.name===name;
            })+funcNamesOffset;
            if(funcIndex===-1)throw "Undeclared function \""+functionLink.name+"\".";
            obj._index=funcIndex;
        }
    });
    
    // remove _functionname and _functiontype fields from CodeWriter and ImportWriter and ExportWriter
    this._exports.forEach(function(obj){
        if(obj._functionname)obj._functionname=undefined;
    });
    this._imports.forEach(function(obj){
        if(obj._functionname){
            obj._functionname=undefined;
            obj._functiontype=undefined;
        }
    });
    this._codes.forEach(function(obj){
        if(obj._functionname){
            obj._functionname=undefined;
            obj._functiontype=undefined;
        }
    });
    
    
    
    
    
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
    
    // IMPORT
    if(this._imports.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.IMPORT);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._imports.length));
        for(var i=0;i<this._imports.length;++i){
            output.append(this._imports[i].toUint8Array());
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // FUNCTION
    if(this._functions.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.FUNCTION);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._functions.length));
        for(var i=0;i<this._functions.length;++i){
            output.append(this._functions[i].toUint8Array());
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // MEMORY
    if(this._memory.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.MEMORY);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._memory.length));
        for(var i=0;i<this._memory.length;++i){
            output.append(this._memory[i].toUint8Array());
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // EXPORT
    if(this._exports.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.EXPORT);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._exports.length));
        for(var i=0;i<this._exports.length;++i){
            output.append(this._exports[i].toUint8Array());
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    // CODE
    if(this._codes.length>0){
        output.push(Wasm32ModuleWriter.sectionCode.CODE);
        var sizeloc=output.size();
        output.append(VLQEncoder.encodeUInt(this._codes.length));
        for(var i=0;i<this._codes.length;++i){
            output.append(this._codes[i].toUint8Array());
        }
        output.insert_arr(sizeloc,VLQEncoder.encodeUInt(output.size()-sizeloc));
    }
    
    return output.toUint8Array();
};
