interface RequestParams<T>{
    endpoint: string,
    method? : "GET" | "POST" | "DELETE" | "PUT",
    body?: BodyInit,
    onSuccess: (data: T) => void,
    onFailure: (error: string) => void
}
export const request = async<T> ( {endpoint, method = "GET", body, onSuccess, onFailure} : RequestParams<T> ) : Promise<void> => {
    try{
        const config: RequestInit = {
            method: method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        }
        if( method !== "GET" && body){
            config.body = body
        }
        const response = await fetch(endpoint, config)
        if(!response.ok){
            const {message } = await response.json()
            throw new Error(message)
        }
        const data = await response.json()
        onSuccess(data)
    }catch(err){
        if(err instanceof Error){
            onFailure(err.message)
        }else{
            onFailure("Ha ocurrido un error. Intentalo mas tarde.")
        }
    }
};