const isPrimitive = (v) =>
    v === null ||
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"

const isDate = (v) =>
    v instanceof Date ||
    (typeof v === "string" && !Number.isNaN(Date.parse(v)))



const sameArrays = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) return false
    if (a.length !== b.length) return false

    return a.every((value, index) => {
        const other = b[index]

        if (isPrimitive(value)) return value === other
        if (isDate(value))
            return isDate(other) && new Date(value).getTime() === new Date(other).getTime()

        if (Array.isArray(value)) return sameArrays(value, other)

        if (typeof value === "object") return sameObjects(value, other)

        return false
    })
}


const sameObjects = (a, b) => {
    if (a === b) return true
    if (!a || !b) return false
    if (typeof a !== "object" || typeof b !== "object") return false
    if (Array.isArray(a) || Array.isArray(b)) return false

    // Mongo priority
    if (a._id && b._id) return a._id === b._id

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    return keysA.every((key) => {
        const valA = a[key]
        const valB = b[key]

        if (isPrimitive(valA)) return valA === valB
        if (isDate(valA))
            return isDate(valB) && new Date(valA).getTime() === new Date(valB).getTime()

        if (Array.isArray(valA)) return sameArrays(valA, valB)

        if (typeof valA === "object") return typeof valB === "object"

        return false
    })
}


export const findSelectedItemTitle = ({ data, valueKey, titleKey, selectedItem }) => {

    let title = null
    const resolvedTitleKey = titleKey ?? "title"

    // Items are objects, prior check in Autocomplete

    for (let item of data) {
        const itemTitle = item[resolvedTitleKey]
        const selectedTitle = selectedItem[resolvedTitleKey]

        const selectedSection = valueKey ? item[valueKey] : null

        // Case where there is no key/value to select in the data array of object items

        if (!valueKey) {
            // selectedItem is an object (because without valueKey the all item is selected), check if a title field match the item title field
            if (itemTitle !== undefined && itemTitle === selectedTitle) {
                title = itemTitle
                break;
            }
        }

        // There was a section of the items that was selected : trying to find the one matching selectedItem
        else if (typeof selectedSection === "string" && selectedSection === selectedItem) {
            title = itemTitle ?? ""
            break;
        }
        else if (selectedSection?._id && selectedSection._id === selectedItem._id) {
            title = itemTitle ?? ""
            break;
        }
        else if (Array.isArray(selectedSection) && sameArrays(selectedItem, selectedSection)) {
            title = itemTitle ?? ""
            break;
        }
        else if (typeof selectedSection === "object" && sameObjects(selectedItem, selectedSection)) {
            title = itemTitle ?? ""
            break;
        }
    }
    return title
}


export const createId = (length) => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('')
    let id = ""
    for (let i = 0; i < length; i++) {
        id += chars[Math.floor(Math.random() * chars.length)]
    }
    return id
}