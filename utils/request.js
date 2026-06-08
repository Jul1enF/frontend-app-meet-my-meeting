import * as SecureStore from 'expo-secure-store';


// Function to count the number of docs (arrays or objects) owned by stored data
// Same way of counting than in sendIfUpdated middleware in the back end
const getDocsCount = (storedData) => {

    // Deserialize data if they have been serialized (by redux)
    const deserializedData = JSON.parse(JSON.stringify(storedData))

    let docsCount = 0
    const visitedDocs = new WeakSet()

    const extractDocsCount = (doc) => {
        if (!doc || typeof doc !== "object" || visitedDocs.has(doc)) return
        visitedDocs.add(doc)

        // Add a doc to the count
        if (doc._id) docsCount += 1

        if (Array.isArray(doc)) {
            doc.forEach(e => extractDocsCount(e))
        }
        else {
            // Searching inside an object for other docs
            for (const key in doc) {
                const val = doc[key];

                // If it is an array
                if (Array.isArray(val) && val.length) {
                    val.forEach(e => extractDocsCount(e))
                }
                // If it is an object
                else if (val && typeof val === "object") {
                    extractDocsCount(val);
                }
            }
        }
    }

    extractDocsCount(deserializedData)

    return docsCount
}




export default async function request({ path, method = "GET", body, params, sendToken, setSessionExpired, functionRef, setWarning, setModalVisible, setUploading, clearEtag, storedData }) {

    const warning = !!setWarning
    const modal = !!setModalVisible
    const uploading = !!setUploading
    const session = !!setSessionExpired

    let warningText
    let sessionExpired

    const readingTime = (text) => text ? Math.round(text.length * 53) : 0

    const displayWarning = (message, success) => {
        if (warning) {
            warningText = message ?? "Erreur : Problème de connexion"
            setWarning({ text: warningText, success: success ?? false })
        }
    }

    if (functionRef) {
        if (!functionRef.current) return;
        functionRef.current = false;
    }
    try {
        warning && setWarning({})
        uploading && setUploading(true)

        const url = process.env.EXPO_PUBLIC_BACK_ADDRESS;

        // Headers
        const headers = {}
        if (sendToken) {
            const jwtToken = await SecureStore.getItemAsync('jwtToken')
            if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`
        }

        if (clearEtag) headers["If-None-Match"] = ""
        if ("storedData" in props) headers["X-Docs-Count"] = getDocsCount(storedData).toString()

        // Options
        const options = { method, headers };

        // Body
        if (body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        // Params
        const urlParams = params
            ? "/" + (Array.isArray(params) ? params.join("/") : params)
            : "";


        // Fetch
        const response = await fetch(`${url}${path}${urlParams}`, options);
        const data = await response.json()

        if (!data.result) {
            displayWarning(data.errorText ?? null)
            sessionExpired = data.sessionExpired
            // If the session has not expired (wich mean automatic expulsion of the user), we return the delay during wich the error message will be displayed (in case of an action needed after) and the data in case of a check inside if it is needed
            if (!sessionExpired) return {
                delay: readingTime(warningText) + 400,
                ...(data && data),
            }
        }
        else if (data.notModified) {
            return
        }
        // Successfull fetch with new data
        else {
            if (data.jwtToken) {
                await SecureStore.setItemAsync('jwtToken', data.jwtToken)
                delete data.jwtToken
            }
            data.successText && displayWarning(data.successText, true)
            data.delay = readingTime(data.successText) + 400
            return data
        }
    }
    catch (fetchError) {
        console.log(`${path.toUpperCase()} FETCH ERROR :`, fetchError)
        displayWarning()
    }
    finally {
        if (functionRef) functionRef.current = true;
        uploading && setUploading(false)

        if (modal || warningText) setTimeout(() => {
            modal && setModalVisible(false)
            warningText && setWarning({})
        }, readingTime(warningText))

        if (session && sessionExpired) {
            const delay = readingTime(warningText) + (modal ? 400 : 0)
            setTimeout(() => setSessionExpired(true), delay)
        }
    }
}