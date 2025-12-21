export default async function request({ path, method = "GET", body, params, jwtToken, setSessionExpired, functionRef, setWarning, setModalVisible, setUploading, clearEtag }) {

    const warning = typeof setWarning === "function"
    const modal = typeof setModalVisible === "function"
    const uploading = typeof setUploading === "function"
    const session = typeof setSessionExpired === "function"

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

        const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
        const options = { method, headers };

        if (clearEtag) headers["If-None-Match"] = ""

        if (body) {
            if (body instanceof FormData) {
                options.body = body;
            } else {
                headers["Content-Type"] = "application/json";
                options.body = JSON.stringify(body);
            }
        }

        const urlParams = params
            ? "/" + (Array.isArray(params) ? params.join("/") : params)
            : "";
       
        const response = await fetch(`${url}/${path}${urlParams}`, options);
        const data = await response.json()

        if (!data.result) {
            displayWarning(data.errorText ?? null)
            sessionExpired = data.sessionExpired
        }
        else if (data.notModified) {
            return
        }
        else {
            data.successText && displayWarning(data.successText, true)
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

        if (session && sessionExpired){
            const delay = readingTime(warningText) + (modal ? 400 : 0)
            setTimeout(()=> setSessionExpired(true), delay)
        }
    }
}