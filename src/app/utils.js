
export const prepData = (data) => {
    if(!data) {
        console.warn('the input data is undefined so nothing to prep');
        return createNode(data,true,false);
    }

    if(Array.isArray(data)) throw Error('Could not prep, input must be object');
    if(data.children && !Array.isArray(data.children)) throw Error('if children prop exist is must be an array');

    let preppedData = createNode(data,false,true);

    if(data.children){
        let children = [];
        for(let child of data.children){
            children.push(prepData(child))
        }
        preppedData.children = children;
    }
    return preppedData;
};

const createNode = (data, hide, included) => ({
    ...data,
    children: data.children || [],
    hide: hide,
    included: included,
});