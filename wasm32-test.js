window.addEventListener("load",function(){
    var moduleWriter=new Wasm32ModuleWriter();
    
    // addTwo: (a,b) => a+b
    
    var codeWriter=new Wasm32CodeWriter();
    codeWriter.get_local(0);
    codeWriter.get_local(1);
    codeWriter.i32_add();
    codeWriter.end();
    var type=new Wasm32TypeWriter([Wasm32VarType.i32,Wasm32VarType.i32],[Wasm32VarType.i32]).toUint8Array();
    moduleWriter.addFunction("addTwo",type,codeWriter);
    moduleWriter.exportFunction("addTwo","nativeAdd");
    
    // triangle: (x) => (x==0)?0:(x+triangle(x-1))
    
    var codeWriter=new Wasm32CodeWriter();
    codeWriter.get_local(0);
    codeWriter.get_local(0);
    codeWriter.if(Wasm32VarType.i32);
    codeWriter.get_local(0);
    codeWriter.i32_const(1);
    codeWriter.i32_sub();
    codeWriter.call("triangle");
    codeWriter.else();
    codeWriter.i32_const(0);
    codeWriter.end();
    codeWriter.i32_add();
    codeWriter.end();
    var type=new Wasm32TypeWriter([Wasm32VarType.i32],[Wasm32VarType.i32]).toUint8Array();
    moduleWriter.addFunction("triangle",type,codeWriter);
    moduleWriter.exportFunction("triangle","triangle");
    
    // addTwoCallback: (a,b) => a+b
    
    var codeWriter=new Wasm32CodeWriter();
    codeWriter.get_local(0);
    codeWriter.get_local(1);
    codeWriter.i32_add();
    codeWriter.call("log");
    codeWriter.get_local(0);
    codeWriter.get_local(1);
    codeWriter.call("log2");
    codeWriter.end();
    var type=new Wasm32TypeWriter([Wasm32VarType.i32,Wasm32VarType.i32],[]).toUint8Array();
    moduleWriter.addFunction("addTwoCallback",type,codeWriter);
    moduleWriter.exportFunction("addTwoCallback","nativeAddCallback");
    moduleWriter.importFunction("log",new Wasm32TypeWriter([Wasm32VarType.i32],[]).toUint8Array(),"console","log");
    moduleWriter.importFunction("log2",new Wasm32TypeWriter([Wasm32VarType.i32,Wasm32VarType.i32],[]).toUint8Array(),"console","log2");
    
    var byteCode=moduleWriter.generateModule();
    var arr=[];
    for(var i=0;i<byteCode.length;++i){
        arr[i]=byteCode[i].toString(16);
    }
    console.log(arr);
    WebAssembly.instantiate(byteCode,{console:{log:function(x){console.log("Callback:" +x);},log2:function(x,y){console.log("Callback:" +x+","+y);}}}).then(function(result){
        var instance=result.instance;
        console.log(instance.exports.nativeAdd(5,5));
        console.log(instance.exports.nativeAdd(1,2));
        console.log(instance.exports.nativeAdd(-2,-5));
        console.log(instance.exports.nativeAdd(-2,5));
        console.log(instance.exports.nativeAdd(1024,1024));
        console.log(instance.exports.triangle(10));
        console.log(instance.exports.triangle(0));
        console.log(instance.exports.triangle(1));
        console.log(instance.exports.triangle(10000));
        instance.exports.nativeAddCallback(1024,1024);
        instance.exports.nativeAddCallback(10,55);
    });
});