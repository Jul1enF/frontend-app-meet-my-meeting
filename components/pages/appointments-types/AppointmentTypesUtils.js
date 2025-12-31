export const sortByCategory = (data) => {
    if (data[0]?.category) {
        data.sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;

            return (a.default_duration - b.default_duration);
        })
    }

    return data

}