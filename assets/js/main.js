const getNodes = callback => {
    $.ajax({
        url: "https://apiserver.edge-net.org/api/v1/nodes",
        type: "GET",
        contentType: "json",
        beforeSend: xhr => {
            xhr.setRequestHeader("Authorization", "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IkxxVFF6WnBEUmNzU2F6UWZWcnRSdlZwUHBxM05VVVhPWUQ1QXAwbEdCRDQifQ.eyJpc3MiOiJrdWJlcm5ldGVzL3NlcnZpY2VhY2NvdW50Iiwia3ViZXJuZXRlcy5pby9zZXJ2aWNlYWNjb3VudC9uYW1lc3BhY2UiOiJyZWdpc3RyYXRpb24iLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlY3JldC5uYW1lIjoicHVibGljLXVzZXItdG9rZW4teHRkNXMiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC5uYW1lIjoicHVibGljLXVzZXIiLCJrdWJlcm5ldGVzLmlvL3NlcnZpY2VhY2NvdW50L3NlcnZpY2UtYWNjb3VudC51aWQiOiJiMjFiZWZmZi1iMzliLTRhNTQtODdmMS0zZDRiNzNlYjY4YzgiLCJzdWIiOiJzeXN0ZW06c2VydmljZWFjY291bnQ6cmVnaXN0cmF0aW9uOnB1YmxpYy11c2VyIn0.Ldw9PNoD6GeMfWN5i617asSOiqoSp9UXC2oqBWAnAV8_l3WLlb1J4ftVICMhSqngEAD57wj-HP98xeUZ6zucsVk5apWMDuyRYg8X8DfA7X0BRQJpmVXQubFuniEckw23vIWHtoPT8_ryePI8pA9OMAkA3blT69n6VaOh26LtSRu9pmV3hlvwoKTaFfy8QhxzgpRvhmPraqnoREQmACpevomU3K_C12q2gLpABO6ah5LZKb9s4dyc_sJuTIp9PmOdGpN_yjK6hFyd0D2INeYMbNyc9HALRlqSlZS7pdWDFuUVnCcdM96D7SZSjPepcSuNQj16adgJTD3fthJUiBgi6g");
        },
        success: result => callback(result.items.map(parseNode)),
        error: error => console.log(`Error ${error}`)
    })
}

const parseNode = node => {
    let ready = false;
    for (const condition of node.status.conditions) {
        if ((condition.type === "Ready") && condition.status === "True") {
            ready = true;
        }
    }
    return {
        name: node.metadata.name,
        latitude: parseFloat(node.metadata.labels["edge-net.io/lat"].slice(1, 8)).toFixed(2),
        longitude: parseFloat(node.metadata.labels["edge-net.io/lon"].slice(1, 8)).toFixed(2),
        city: node.metadata.labels["edge-net.io/city"].replace("_", " "),
        region: node.metadata.labels["edge-net.io/state-iso"],
        country: node.metadata.labels["edge-net.io/country-iso"],
        creationDate: new Date(node.metadata.creationTimestamp),
        ready: ready
    }
};

const initNodesTable = nodes => {
    const data = nodes.map(node => ({
        "Name": node.name,
        "Location": `${node.latitude},${node.longitude}`,
        "City": node.city,
        "Region": node.region,
        "Country": node.country,
        "Date Added": node.creationDate.toLocaleDateString("en-us"),
        "Status": node.ready ? "Ready" : "Not Ready"
    }));
    const columns = Object.keys(data[0]).map(key => ({data: key, title: key}));
    $('#nodes-table').DataTable({
        columns: columns,
        data: data
    });
};

const initNodesMap = nodes => {
    const map = L.map("nodes-map").setView([48.0, 2.0], 1.5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
        foo: 'bar',
        tap: false,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    for (const node of nodes) {
        const marker = L.marker([node.latitude, node.longitude]).addTo(map);
        marker.bindPopup(`
            <strong>${node.name}</strong>
            <ul>
                <li><strong>City:</strong> ${node.city}</li>
                <li><strong>Region:</strong> ${node.region}</li>
                <li><strong>Country:</strong> ${node.country}</li>
                <li><strong>Date Added:</strong> ${node.creationDate.toLocaleDateString("en-us")}</li>
                <li><strong>Status:</strong> ${node.ready ? "Ready" : "Not Ready"}</li>
            </ul>
        `);
    }
};

$(document).ready(() => {
    getNodes(nodes => {
        // TODO: Display # of nodes/ready nodes.
        initNodesTable(nodes);
        initNodesMap(nodes);
    });
});
