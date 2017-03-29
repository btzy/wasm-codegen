var encodeUIntString=function(str){
    return new TextEncoder().encode(str);
};

var VLQEncoder={};

VLQEncoder.encodeUInt=function(value){
    if(value<0||value!==Math.floor(value))debugger;
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
    if(value!==Math.floor(value))debugger;
    var output=new ResizableUint8Array();
    var is_neg=(value<0);
    if(is_neg)value=-value-1;
    while(true){
        var next_val=value%128;
        value=Math.floor(value/128);
        if(value>0||next_val>=64){
            if(is_neg)output.push((~next_val)&255);
            else output.push(128+next_val);
        }
        else{
            if(is_neg)output.push((~next_val)&127);
            else output.push(next_val);
            break;
        }
    }
    return output.toUint8Array();
};