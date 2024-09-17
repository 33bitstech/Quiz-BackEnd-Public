export function margeArrays (sourceArrayToMerge: Array<any>, arrayToBeUsedForMerge: Array<any>, keyToBeAdded:string, keyToBeAdded2: string): Array<any> {
   return sourceArrayToMerge.map((item, index) => {
       const obj = {
        ...item
       }
       obj[keyToBeAdded] = arrayToBeUsedForMerge[index][keyToBeAdded]

       if(keyToBeAdded2) {
           obj[keyToBeAdded2] = arrayToBeUsedForMerge[index][keyToBeAdded2]
       }

       return obj
    })
}