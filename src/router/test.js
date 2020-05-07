var arr = [2,4,3,0]

const sort = (oArr) => {
    if(oArr.length <=1 ){
        return oArr
    } else{
        let left = []
    let right = []
    let newArr = []
    let pivot = oArr.pop()
    let lenght = oArr.length
    for(let i = 0; i < lenght; i++) {
        if(oArr[i] <= pivot) {
            left.push(oArr[i])
        }else{
            right.push(oArr[i])
        }
    }
    return newArr.concat(sort(left), pivot, sort(right))
    }
}

console.log(sort(arr));

