$(document).ready(() => {
    const getNodes = callback => {
        $.ajax({
            url: "https://apiserver.edge-net.org/api/v1/nodes",
            type: "GET",
            contentType: "json",
            beforeSend: xhr => {
                xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkxxVFF6WnBEUmNzU2F6UWZWcnRSdlZwUHBxM05VVVhPWUQ1QXAwbEdCRDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJyZWdpc3RyYXRpb24iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoicHVibGljLXVzZXItdG9rZW4teHRkNXMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoicHVibGljLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMjFiZWZmZi1iMzliLTRhNTQtODdmMS0zZDRiNzNlYjY4YzgiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6cmVnaXN0cmF0aW9uOnB1YmxpYy11c2VyIn0.Ldw9PNoD6GeMfWN5i617asSOiqoSp9UXC2oqBWAnAV8_l3WLlb1J4ftVICMhSqngEAD57wj-HP98xeUZ6zucsVk5apWMDuyRYg8X8DfA7X0BRQJpmVXQubFuniEckw23vIWHtoPT8_ryePI8pA9OMAkA3blT69n6VaOh26LtSRu9pmV3hlvwoKTaFfy8QhxzgpRvhmPraqnoREQmACpevomU3K_C12q2gLpABO6ah5LZKb9s4dyc_sJuTIp9PmOdGpN_yjK6hFyd0D2INeYMbNyc9HALRlqSlZS7pdWDFuUVnCcdM96D7SZSjPepcSuNQj16adgJTD3fthJUiBgi6g");
            },
            success: result => callback(result.items),
            error: error => console.log(`Error ${error}`)
        })
    }

    const parseNodes = nodes => nodes.map(node => {
        const latitude = parseFloat(node.metadata.labels["edge-net.io/lat"].slice(1, 8)).toFixed(2);
        const longitude = parseFloat(node.metadata.labels["edge-net.io/lon"].slice(1, 8)).toFixed(2);
        const city = node.metadata.labels["edge-net.io/city"].replace("_", " ");
        const region = node.metadata.labels["edge-net.io/state-iso"];
        const country = node.metadata.labels["edge-net.io/country-iso"];
        const creationDate = new Date(node.metadata.creationTimestamp);

        let ready = false;
        for (const condition of node.status.conditions) {
            if ((condition.type === "Ready") && condition.status === "True") {
                ready = true;
            }
        }

        return {
            "Name": node.metadata.name,
            "Location": `${latitude},${longitude}`,
            "City": city,
            "Region": region,
            "Country": country,
            "Date Added": creationDate.toLocaleDateString("en-us"),
            "Status": ready ? "Ready" : "Not Ready"
        };
    });

    getNodes(nodes => {
        const data = parseNodes(nodes);
        const columns = Object.keys(data[0]).map(key => ({data: key, title: key}));
        $('#nodes-table').DataTable({
            columns: columns,
            data: data
        });
    });
});