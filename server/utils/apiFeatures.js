class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr
    }

    //! search feature
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",                // "i" means case insensetive that means when we search for product even in small or capital letters we will get result irrespective of the case
            },
        } : {}

        this.query = this.query.find({ ...keyword });
        return this
    }

    //!filter feature
    filter() {
        const queryCopy = { ...this.queryStr } //spread operator is used because we dont want to change the original query which will result seach filter not working because if we just use the queryCopy = this.query then object ref will be pass to it and original object will change to avoid this we have to clone the this.query which we can achieve by using spread operator

        // removing some fields for category
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach((item) => {
            delete queryCopy[item];    //by using delete keyword we delete the selected items from object
        });

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (item) => `$${item}`) //as we know to get price greter than or equal or any other operator we use them like $gt,$gte but here the doller sign is not there to add this doller sign before the query word we are doing this operation.


        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }

    //!pagination feature
    pagination(resultPerPage){
        let currentPage = Number(this.queryStr.page) || 1;
        
        let skip = resultPerPage * (currentPage-1);

        this.query = this.query.limit(resultPerPage).skip(skip);
        
        return this;
    }
}

module.exports = ApiFeatures;