// type = uint8array, code = uint8array, export_name = string
var Wasm32LogicalFunction=function(type,code,export_name){
    this._type=type;
    this._code=code;
    if(export_name)this._exportName=export_name;
};