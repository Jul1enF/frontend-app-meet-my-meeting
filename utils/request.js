export default async function request({path, method = "GET", body, params, jwtToken, ref, setWarning, setModalVisible, setUploading}) {

    const warning = typeof setWarning === "function" ? true : false
    const modal = typeof setModalVisible === "function" ? true : false
    const uploading = typeof setUploading === "function" ? true : false

    const displayWarning = (message) => {
        if (warning) {
            setWarning(message ? message : "Erreur : Problème de connexion")
            setTimeout(() => setWarning(""), 4500);
        }
    }

    if (ref) {
        if (!ref.current) return;
        ref.current = false;
    }
    try {
        warning && setWarning("")
        uploading && setUploading(true)

        const url = process.env.EXPO_PUBLIC_BACK_ADDRESS;

        const headers = jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {};
        const options = { method, headers };

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

        if (data.error) {
            displayWarning(data.error)
        } else if (!data.result) {
            displayWarning()
        } else {
            data.successMsg && displayWarning(data.successMsg)
            return data
        }
    }
    catch (fetchError) {
        console.log(`${path.toUpperCase()} FETCH ERROR :`, fetchError)
        displayWarning()
    }
    finally {
        if (ref) ref.current = true;
        uploading && setUploading(false)
        modal && setTimeout(() => setModalVisible(false), 4500)
    }
}