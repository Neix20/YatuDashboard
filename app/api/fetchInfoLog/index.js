import { Utility } from "@utility";

const Index = async (props) => {

    const { param } = props;
    const { onSetLoading } = props;

    const action = "InfoLog";
    const url = Utility.genServerUrl(action);

    // Static Data
    let obj = {
        content: {
            ...param,
            app: "Yatu Dashboard",
        }
    };

    const resp = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(obj),
    });

    const data = await resp.json();
    onSetLoading(false);

    if (data["ResponseCode"] === "00") {
        console.log("Info Logging!");
    }
    else {
        console.log(`InfoLog - Request - ${JSON.stringify(obj)}`);
        console.log(`InfoLog - Response - ${JSON.stringify(data)}`);
    }

    return data;
};

export default Index;