var encodeUIntString=function(str){
    return new TextEncoder().encode(str);
};

var VLQEncoder={};

VLQEncoder.encodeUInt=function(value){
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

VLQEncoder.encodeInt=function(value){
    // TODO.
    throw "Not implemented yet :(";
};