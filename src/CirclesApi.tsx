export default class CirclesApi {
    endpoint = "circles";

    serviceAddress: string;

    constructor(serviceAddress : string) {
        let a = "";
        this.serviceAddress = serviceAddress;
    }

    getUrl() : URL {
        return new URL(this.endpoint, this.serviceAddress);
    }

    GetData(callback: (defaultColor: string, lastColor: string, greeting: string) => void) {
        fetch(this.getUrl()).then(r=>r.json())
            .then(
                (response) => {
                    callback(response["default-circle-color"], response["last-circle-color"], response["greeting"]);
                },
                (err) => {
                    console.warn("Could not connect to the backend. Is the C++ app running?");
                }
            );
    }
}