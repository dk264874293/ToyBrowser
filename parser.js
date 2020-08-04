const EOF = Symbol('EOF')
let currentToken = null;
let currentAttribute = null

function emit(token){
  console.log(token)
}

// 初始状态
function data(c){
  if(c === '<'){
    return tagOpen
  }else if (c === EOF) {
    emit({
      type:'EOF'
    })
    return;
  } else {
    emit({
      type:'text',
      content:c
    })
    return data;
  }
}
// 标签开始
function tagOpen(c){
  if(c === '/'){
    return endTagOpen
  }else if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type:'startTag',
      tagName:''
    }
    return tagName(c)
  }else{
    return
  }
}
// 标签结束
function endTagOpen(c){
  if(c.match(/^[a-zA-Z]$/)){
    currentToken = {
      type:'endTag',
      tagName:''
    }
    return tagName(c)
  }else if(c === '>'){
    
  }else if(c === EOF){

  }else{

  }
}
// 标签名
function tagName(c){
  if(c.match(/^[\r\t\f ]$/)){
    return beforeAttributeName
  }else if(c === '/' ){
    return selfClosingStartTag
  }else if(c.match(/^[a-zA-Z]$/)){
    currentToken.tagName += c
    return tagName
  }else if(c === '>'){
    emit(currentToken);
    return data
  }else {
    return tagName
  }
}
// 标签属性
function beforeAttributeName(c){
  if (c.match(/^[\t\n\f ]$/)) {
    return beforeAttributeName;
  }  else if (c === '/' || c === '>' || c === EOF) {
    return afterAttributeName(c)
  } else if (c === ">") {
    return data;
  } else if(c === '='){
    // return beforeAttributeName;
  } else {
    currentAttribute = {
      name: "",
      value: "",
    };
    return attributeName(c);
  }
}

function beforeAttributeValue(c){
  if(c.match(/^[\t\n\f ]$/) || c === '/' || c === '>' || c === EOF){
    return beforeAttributeValue
  }else if(c === '\"'){
    return doubleQuotedAttributeValue
  }else if(c === '\''){
    return singleQuotedAttributeValue
  }else {
    return UnquotedAttributeValue(c)
  }
}

function afterQuotedAttributeValue(c){
  if(c.match(/^[\r\t\f ]$/)){
    return beforeAttributeName
  }else if(c === '/'){
    return selfClosingStartTag
  }else if(c === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  }else if(c === EOF){

  }else {
    currentAttribute.value += c
    return doubleQuotedAttributeValue;
  }
}

function doubleQuotedAttributeValue(c){
  if( c === '\"'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return afterQuotedAttributeValue
  }else if(c === "\u0000"){

  }else if(c === EOF){

  }else{
    currentAttribute.value += c
    return doubleQuotedAttributeValue
  }
}

function singleQuotedAttributeValue(c) {
  if (c === '\'') {
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === EOF) {
  } else {
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function UnquotedAttributeValue(c){
  if(c.match(/^[\r\t\f ]$/)){
    currentToken[currentAttribute.name] = currentAttribute.value
    return beforeAttributeName
  }else if(c === '/'){
    currentToken[currentAttribute.name] = currentAttribute.value
    return selfClosingStartTag
  }else if(c === '>'){
    currentToken[currentAttribute.name] = currentAttribute.value
    emit(currentToken)
    return data
  }else if(c === '\u0000'){

  }else if(c === '"' || c === "'" || c === '<' || c === '=' || c === '`'){

  }else if(c === EOF){

  }else {
    currentAttribute.value += c
    return UnquotedAttributeValue;
  }
}

function afterAttributeName(c){

}

function attributeName(c) {
  if (c.match(/^[\t\n\f ]$/) || c === "/" || c === ">" || c === EOF) {
    return afterAttributeName(c);
  } else if (c === "=") {
    return beforeAttributeValue;
  } else if (c === "\u0000") {
  } else if (c === '"' || c === "'" || c === "<") {
  } else {
    currentAttribute.name += c;
    return attributeName;
  }
}

function selfClosingStartTag(c){
  if(c === '>'){
    currentToken.isSelfClosing = true
    return data
  }else if(c === EOF){

  }else{

  }
}

module.exports.parseHTML = function parseHTML(html) {
  let state = data
  for(let c of html){
    state = state(c)
  }
  state = state(EOF)
  console.log(html);
};