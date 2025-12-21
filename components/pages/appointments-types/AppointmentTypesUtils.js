export const sortBySubcategory = (data) => {
    if (data[0]?.sub_category) {
        data.sort((a, b) => {
            if (a.sub_category < b.sub_category) return -1;
            if (a.sub_category > b.sub_category) return 1;
            return 0;
        })
    }

    return data

}