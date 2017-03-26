var VLQEncoder={};
VLQEncoder.encode=function(value){
    var output=new ResizableUint8Array();
    while(true){
        var next_val=value%128;
        value=Math.floor(value/128);
        if(value>0){
            output.push(128+next_val);
        }
        else{
            output.push(next_val);
            break;
        }
    }
    return output.toUint8Array();
};