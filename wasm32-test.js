window.addEventListener("load",function(){
    var codeWriter=new Wasm32CodeWriter();
    codeWriter.get_local(0);
    codeWriter.get_local(1);
    codeWriter.i32_add();
    codeWriter.end();
    var functionType=new Uint8Array(6);
    functionType[0]=0x60;
    functionType[1]=0x02;
    functionType[2]=0x7f;
    functionType[3]=0x7f;
    functionType[4]=0x01;
    functionType[5]=0x7f;
    var moduleWriter=new Wasm32ModuleWriter();
    moduleWriter.addLogicalFunction(new Wasm32LogicalFunction(functionType,codeWriter.toUint8Array(),"addTwo"));
    var byteCode=moduleWriter.generateModule();
    var arr=[];
    for(var i=0;i<byteCode.length;++i){
        arr[i]=byteCode[i].toString(16);
    }
    console.log(arr);
    WebAssembly.instantiate(byteCode).then(function(result){
        var instance=result.instance;
        console.log(instance.exports.addTwo(5,5));
        console.log(instance.exports.addTwo(1,2));
        console.log(instance.exports.addTwo(-2,-5));
        console.log(instance.exports.addTwo(-2,5));
        console.log(instance.exports.addTwo(1024,1024));
    });
});