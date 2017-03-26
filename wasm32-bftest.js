window.addEventListener("load",function(){
    var data=document.getElementById("codetextbox").value;
    
    var memoryWriter=new Wasm32MemoryWriter(4,4);
    
    var typeWriter=new Wasm32TypeWriter([],[]);
    
    var codeWriter=new Wasm32CodeWriter([Wasm32VarType.i32]);
    codeWriter.set
    
    
    var codeWriter=new Wasm32CodeWriter();
    codeWriter.get_local(0);
    codeWriter.get_local(1);
    codeWriter.i32_add();
    codeWriter.end();
    var typeWriter=new Wasm32TypeWriter([Wasm32VarType.i32,Wasm32VarType.i32],[Wasm32VarType.i32]);
    var moduleWriter=new Wasm32ModuleWriter();
    moduleWriter.addLogicalFunction(new Wasm32LogicalFunction(typeWriter.toUint8Array(),codeWriter.toUint8Array(),"nativeAdd"));
    var byteCode=moduleWriter.generateModule();
    var arr=[];
    for(var i=0;i<byteCode.length;++i){
        arr[i]=byteCode[i].toString(16);
    }
    console.log(arr);
    WebAssembly.instantiate(byteCode).then(function(result){
        var instance=result.instance;
        console.log(instance.exports.nativeAdd(5,5));
        console.log(instance.exports.nativeAdd(1,2));
        console.log(instance.exports.nativeAdd(-2,-5));
        console.log(instance.exports.nativeAdd(-2,5));
        console.log(instance.exports.nativeAdd(1024,1024));
    });
});