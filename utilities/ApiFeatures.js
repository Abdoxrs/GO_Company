module.exports = class ApiFeatures {
  constructor(dbQuery, requestQuery) {
    this.dbQuery = dbQuery;
    this.requestQuery = requestQuery;
  }

  pagginate(pageNumber = 1, pageSize = 5) {
    pageNumber = this.requestQuery.pageNumber || pageNumber;
    pageSize = this.requestQuery.pageSize || pageSize;
    let skip = 0;
    if (pageNumber != 1) skip = (pageNumber - 1) * pageSize;
    this.dbQuery = this.dbQuery.skip(skip).limit(pageSize);
    return this;
  }
  sort(){
    if (this.requestQuery.sort){
      const sortBy = this.requestQuery.sort.split(",").join(" ");
      this.dbQuery = this.dbQuery.sort(sortBy);
      console.log(sortBy);
      return this; 
    }
  }
};//projection