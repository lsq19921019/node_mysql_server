
    var replaceUnderLine = function(val, char = '_'){
         const arr = val.split('')
         const index = arr.indexOf(char)
         arr.splice(index, 2, arr[index+1].toUpperCase())
         val = arr.join('')
         return val
       }
module.exports = {
    toHump:function toHump(name) {
        return name.replace(/\_(\w)/g, function(all, letter){
            return letter.toUpperCase();
        });
    },
    genID(){
        return Date.now();
        },
// 驼峰转换下划线
    toLine:function toLine(name) {
    return name.replace(/([A-Z])/g,"_$1").toLowerCase();
    },
    filterUnderLine:(obj, char = '_') => {
         const arr =  Object.keys(obj).filter(item => item.indexOf(char) !== -1)
         arr.forEach(item => {
           const before = obj[item]
           const key = replaceUnderLine(item)
           obj[key] = before
           delete obj[item]
         })
         return obj
       }
}